import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { MaskText, Photo } from '../components/Reveal'
import { useApp } from '../context/AppContext'
import { modalities } from '../data/modalities'
import { classSessions } from '../data/schedule'
import { useMediaQuery } from '../hooks'
import { ease } from '../lib/motion'
import type { Modality, ModalityId } from '../types'
import styles from './Modalities.module.css'

/** Motivo gráfico próprio de cada modalidade (dá identidade sem trocar a interface). */
function Motif({ id }: { id: ModalityId }) {
  const common = { className: styles.motif, viewBox: '0 0 120 48', 'aria-hidden': true as const }
  switch (id) {
    case 'musculacao': // barras de carga progressiva
      return (
        <svg {...common}>
          {[10, 16, 22, 30, 38, 46].map((h, i) => (
            <rect key={i} x={i * 20} y={48 - h} width="12" height={h} rx="2" />
          ))}
        </svg>
      )
    case 'funcional': // estações de circuito
      return (
        <svg {...common}>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={10 + i * 25} cy={i % 2 ? 14 : 34} r="7" />
          ))}
          <path d="M10 34 35 14 60 34 85 14 110 34" fill="none" strokeWidth="2" />
        </svg>
      )
    case 'cardio': // batimento em zona
      return (
        <svg {...common}>
          <path d="M0 30h34l8-20 12 32 10-24 6 12h50" fill="none" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      )
    case 'coletivas': // grupo
      return (
        <svg {...common}>
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={8 + (i % 6) * 21} cy={i < 6 ? 14 : 36} r={i === 4 ? 7 : 5} />
          ))}
        </svg>
      )
  }
}

function countClasses(id: ModalityId) {
  return classSessions.filter((c) => c.modality === id).length
}

function Details({ m, onSchedule, onVisit }: { m: Modality; onSchedule: () => void; onVisit: () => void }) {
  return (
    <>
      <p className={styles.desc}>{m.description}</p>
      <ul className={styles.benefits}>
        {m.benefits.map((b) => (
          <li key={b}>
            <Icon name="check" size={18} />
            {b}
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <Button size="sm" icon="arrowRight" onClick={onSchedule}>
          Ver horários de {m.name.toLowerCase()}
        </Button>
        <Button size="sm" variant="secondary" onClick={onVisit}>
          Agendar aula experimental
        </Button>
      </div>
    </>
  )
}

export function Modalities() {
  const { showSchedule, requestVisit } = useApp()
  const wide = useMediaQuery('(min-width: 1024px)')
  const reduce = useReducedMotion()
  const [active, setActive] = useState<ModalityId>('musculacao')
  const [openMobile, setOpenMobile] = useState<ModalityId | null>(null)

  return (
    <section id="modalidades" className={`section ${styles.section}`} aria-labelledby="mod-title">
      <div className="container">
        <header className="section-head">
          <MaskText id="mod-title" className="display" lines={['Quatro jeitos', 'de treinar.']} />
          <p className="lead">
            Escolha por onde começar. Todos os planos incluem musculação e cardio; funcional e aulas coletivas entram a partir do Performance.
          </p>
        </header>

        {wide ? (
          <div className={styles.accordion} role="list">
            {modalities.map((m) => {
              const isActive = active === m.id
              return (
                <motion.article
                  key={m.id}
                  role="listitem"
                  className={styles.panel}
                  data-active={isActive || undefined}
                  data-modality={m.id}
                  initial={false}
                  animate={{ flexGrow: isActive ? 3.4 : 1 }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: ease.inOut }}
                  onMouseEnter={() => setActive(m.id)}
                  onFocusCapture={() => setActive(m.id)}
                  aria-labelledby={`mod-${m.id}`}
                >
                  <Photo src={m.image} alt={m.imageAlt} className={styles.panelPhoto} />
                  <div className={styles.shade} aria-hidden="true" />

                  <div className={`${styles.panelBody} on-dark`}>
                    <div className={styles.panelHead}>
                      <h3 id={`mod-${m.id}`} className={styles.name}>
                        <button
                          type="button"
                          className={styles.nameBtn}
                          aria-expanded={isActive}
                          aria-controls={`mod-detail-${m.id}`}
                          onClick={() => setActive(m.id)}
                        >
                          {m.name}
                        </button>
                      </h3>
                      <p className={styles.focus}>{m.focus}</p>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id={`mod-detail-${m.id}`}
                          className={styles.detail}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.out, delay: 0.25 } }}
                          exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        >
                          <div className={styles.formatRow}>
                            <Motif id={m.id} />
                            <p>
                              {m.format}
                              <span>{countClasses(m.id)} aulas na grade da semana</span>
                            </p>
                          </div>
                          <Details
                            m={m}
                            onSchedule={() => showSchedule(m.id)}
                            onVisit={() => requestVisit({ modality: m.id })}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.article>
              )
            })}
          </div>
        ) : (
          <ul className={styles.stack}>
            {modalities.map((m) => {
              const open = openMobile === m.id
              return (
                <li key={m.id} className={styles.card} data-modality={m.id}>
                  <div className={styles.cardMedia}>
                    <Photo src={m.image} alt={m.imageAlt} />
                    <div className={`${styles.cardTitle} on-dark`}>
                      <Motif id={m.id} />
                      <h3 className={styles.name}>{m.name}</h3>
                      <p className={styles.focus}>{m.focus}</p>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.desc}>{m.description}</p>
                    <button
                      type="button"
                      className={styles.more}
                      aria-expanded={open}
                      aria-controls={`mod-m-${m.id}`}
                      onClick={() => setOpenMobile(open ? null : m.id)}
                    >
                      {open ? 'Ocultar benefícios' : 'Ver benefícios e horários'}
                      <Icon name={open ? 'minus' : 'plus'} size={18} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={`mod-m-${m.id}`}
                          className={styles.cardMore}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: ease.out }}
                        >
                          <div className={styles.cardMoreInner}>
                            <p className={styles.formatText}>
                              {m.format}. {countClasses(m.id)} aulas na grade da semana.
                            </p>
                            <ul className={styles.benefits}>
                              {m.benefits.map((b) => (
                                <li key={b}>
                                  <Icon name="check" size={18} />
                                  {b}
                                </li>
                              ))}
                            </ul>
                            <div className={styles.actions}>
                              <Button size="sm" icon="arrowRight" onClick={() => showSchedule(m.id)}>
                                Ver horários
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => requestVisit({ modality: m.id })}>
                                Aula experimental
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
