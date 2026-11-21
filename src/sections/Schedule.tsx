import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { MaskText } from '../components/Reveal'
import { useApp } from '../context/AppContext'
import { modalities, modalityById } from '../data/modalities'
import { classSessions, days } from '../data/schedule'
import { ease } from '../lib/motion'
import type { ClassSession, DayId } from '../types'
import styles from './Schedule.module.css'

function todayId(): DayId {
  const map: (DayId | null)[] = [null, 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
  return map[new Date().getDay()] ?? 'seg'
}

const levelDots: Record<ClassSession['level'], number> = {
  Iniciante: 1,
  Intermediário: 2,
  Avançado: 3,
  'Todos os níveis': 0,
}

export function Schedule() {
  const { scheduleModality, setScheduleModality, interests, toggleInterest, requestVisit, notify } = useApp()
  const [day, setDay] = useState<DayId>(todayId)

  const dayClasses = useMemo(() => classSessions.filter((c) => c.day === day), [day])
  const visible = useMemo(
    () => dayClasses.filter((c) => scheduleModality === 'all' || c.modality === scheduleModality),
    [dayClasses, scheduleModality],
  )
  const countFor = (m: string) => (m === 'all' ? dayClasses.length : dayClasses.filter((c) => c.modality === m).length)

  const chosen = classSessions.filter((c) => interests.includes(c.id))
  const dayLong = days.find((d) => d.id === day)!.long

  const onInterest = (c: ClassSession) => {
    const adding = !interests.includes(c.id)
    toggleInterest(c.id)
    notify(
      adding
        ? `${c.name} de ${days.find((d) => d.id === c.day)!.long.toLowerCase()} às ${c.time} foi sinalizada. Nada foi reservado ainda.`
        : `${c.name} saiu da sua lista.`,
      adding ? 'success' : 'info',
    )
  }

  const takeToVisit = () => {
    const first = chosen[0]
    requestVisit({
      modality: first?.modality,
      note: chosen.map((c) => `${c.name} (${days.find((d) => d.id === c.day)!.short} ${c.time})`).join(', '),
    })
  }

  return (
    <section id="aulas" className={`section ${styles.section}`} aria-labelledby="aulas-title">
      <div className="container">
        <header className="section-head">
          <MaskText id="aulas-title" className="display" lines={['Grade', 'da semana.']} />
          <div className={styles.headSide}>
            <p className="lead">Filtre por dia e modalidade, veja as vagas e sinalize as aulas que quer experimentar.</p>
            <p className="demo-tag">Grade, professores e vagas demonstrativos</p>
          </div>
        </header>

        <div className={styles.filters}>
          <div className={styles.days} role="group" aria-label="Dia da semana">
            {days.map((d) => (
              <button
                key={d.id}
                type="button"
                className={styles.day}
                aria-pressed={day === d.id}
                onClick={() => setDay(d.id)}
              >
                <span className={styles.dayShort}>{d.short}</span>
                <span className="sr-only">{d.long}</span>
                {day === d.id && <motion.span layoutId="day-pill" className={styles.dayPill} transition={{ duration: 0.3, ease: ease.out }} />}
              </button>
            ))}
          </div>

          <div className={styles.mods} role="group" aria-label="Modalidade">
            {(['all', ...modalities.map((m) => m.id)] as const).map((m) => (
              <button
                key={m}
                type="button"
                className="chip"
                aria-pressed={scheduleModality === m}
                onClick={() => setScheduleModality(m)}
              >
                {m === 'all' ? 'Todas' : modalityById[m].name}
                <span className="chip-count">{countFor(m)}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {visible.length} aulas na {dayLong.toLowerCase()}
          {scheduleModality !== 'all' ? ` em ${modalityById[scheduleModality].name}` : ''}.
        </p>

        <div className={styles.table} role="table" aria-label={`Aulas de ${dayLong}`}>
          <div className={styles.thead} role="rowgroup">
            <div className={styles.row} role="row">
              <span role="columnheader">Horário</span>
              <span role="columnheader">Aula</span>
              <span role="columnheader">Duração</span>
              <span role="columnheader">Nível</span>
              <span role="columnheader">Vagas</span>
              <span role="columnheader">
                <span className="sr-only">Ação</span>
              </span>
            </div>
          </div>

          <div role="rowgroup">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((c, i) => {
                const marked = interests.includes(c.id)
                const booked = c.booked + (marked ? 1 : 0)
                const left = Math.max(c.capacity - booked, 0)
                const full = c.booked >= c.capacity
                return (
                  <motion.div
                    key={c.id}
                    layout
                    role="row"
                    className={styles.row}
                    data-marked={marked || undefined}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: ease.out, delay: i * 0.03 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    <span role="cell" className={styles.time}>
                      {c.time}
                    </span>
                    <span role="cell" className={styles.name}>
                      <strong>{c.name}</strong>
                      <span>
                        {modalityById[c.modality].name} com {c.coach}
                      </span>
                    </span>
                    <span role="cell" className={styles.meta}>
                      <span className={styles.metaLabel}>Duração</span>
                      {c.durationMin} min
                    </span>
                    <span role="cell" className={styles.meta}>
                      <span className={styles.metaLabel}>Nível</span>
                      <span className={styles.level} aria-hidden="true">
                        {[1, 2, 3].map((n) => (
                          <i key={n} data-on={levelDots[c.level] === 0 || n <= levelDots[c.level] || undefined} />
                        ))}
                      </span>
                      {c.level}
                    </span>
                    <span role="cell" className={styles.spots}>
                      <span className={styles.bar} aria-hidden="true">
                        <motion.span
                          initial={false}
                          animate={{ scaleX: booked / c.capacity }}
                          transition={{ duration: 0.4, ease: ease.out }}
                          data-full={full || undefined}
                        />
                      </span>
                      <span>{full ? 'Turma cheia' : `${left} de ${c.capacity} vagas`}</span>
                    </span>
                    <span role="cell" className={styles.action}>
                      <button
                        type="button"
                        className={styles.interest}
                        aria-pressed={marked}
                        disabled={full && !marked}
                        onClick={() => onInterest(c)}
                        aria-label={
                          full
                            ? `${c.name} às ${c.time}: turma cheia`
                            : `${marked ? 'Remover interesse em' : 'Tenho interesse em'} ${c.name} às ${c.time}`
                        }
                      >
                        <Icon name={marked ? 'check' : full ? 'close' : 'plus'} size={18} />
                        {full ? 'Sem vagas' : marked ? 'Sinalizada' : 'Tenho interesse'}
                      </button>
                    </span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {visible.length === 0 && (
            <div className={styles.empty}>
              <p>
                Não há aulas de {scheduleModality !== 'all' ? modalityById[scheduleModality].name.toLowerCase() : ''} na{' '}
                {dayLong.toLowerCase()}.
              </p>
              <Button size="sm" variant="secondary" onClick={() => setScheduleModality('all')}>
                Mostrar todas as modalidades
              </Button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {chosen.length > 0 && (
            <motion.div
              className={`${styles.tray} on-dark`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: ease.out }}
            >
              <div>
                <p className={styles.trayTitle}>
                  {chosen.length} {chosen.length === 1 ? 'aula sinalizada' : 'aulas sinalizadas'}
                </p>
                <p className={styles.trayText}>
                  {chosen.map((c) => `${c.name}, ${days.find((d) => d.id === c.day)!.short} ${c.time}`).join(' / ')}
                </p>
              </div>
              <Button icon="arrowRight" onClick={takeToVisit}>
                Levar para o agendamento
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
