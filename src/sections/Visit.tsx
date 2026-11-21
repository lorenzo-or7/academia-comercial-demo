import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { MaskText, Photo } from '../components/Reveal'
import { useApp } from '../context/AppContext'
import { brand } from '../data/brand'
import { modalities, modalityById } from '../data/modalities'
import { planById } from '../data/plans'
import { ease } from '../lib/motion'
import { formatLongDate, slotsFor, upcomingVisitDays } from '../lib/visit'
import { hasWhatsappNumber, whatsappLink } from '../lib/whatsapp'
import type { Billing, ModalityId, PlanId } from '../types'
import styles from './Visit.module.css'

const goals = [
  'Ganhar força e massa muscular',
  'Melhorar condicionamento',
  'Sair do sedentarismo',
  'Treinar em grupo',
  'Ainda não sei, quero conhecer',
]

interface FormState {
  name: string
  goal: string
  modality: ModalityId | ''
  dayIndex: number | null
  time: string
  plan: PlanId | null
  billing: Billing
  note: string
}

type Errors = Partial<Record<'name' | 'goal' | 'modality' | 'day' | 'time', string>>

const empty: FormState = { name: '', goal: '', modality: '', dayIndex: null, time: '', plan: null, billing: 'monthly', note: '' }

function validate(f: FormState): Errors {
  const e: Errors = {}
  const name = f.name.trim()
  if (!name) e.name = 'Informe seu nome para a equipe saber quem vai receber.'
  else if (name.length < 2) e.name = 'O nome precisa ter pelo menos 2 letras.'
  else if (!/^[\p{L}\s'.-]+$/u.test(name)) e.name = 'Use apenas letras no nome.'
  if (!f.goal) e.goal = 'Escolha um objetivo.'
  if (!f.modality) e.modality = 'Escolha a modalidade que quer conhecer.'
  if (f.dayIndex === null) e.day = 'Escolha um dia.'
  if (!f.time) e.time = f.dayIndex === null ? 'Escolha um dia para ver os horários.' : 'Escolha um horário.'
  return e
}

export function Visit() {
  const { visitPrefill, notify } = useApp()
  const uid = useId()
  const visitDays = useMemo(() => upcomingVisitDays(6), [])
  const [form, setForm] = useState<FormState>(empty)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const summaryRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  // pré-preenchimento vindo de outras seções (planos, grade, modalidades, simulador)
  useEffect(() => {
    if (!visitPrefill.stamp) return
    setConfirmed(false)
    setForm((f) => ({
      ...f,
      modality: visitPrefill.modality ?? f.modality,
      plan: visitPrefill.plan ?? f.plan,
      billing: visitPrefill.billing ?? f.billing,
      note: visitPrefill.note ?? f.note,
    }))
  }, [visitPrefill])

  const errors = validate(form)
  const show = (k: keyof Errors) => (submitted || touched[k]) && errors[k]
  const slots = form.dayIndex !== null ? slotsFor(visitDays[form.dayIndex]) : []
  const day = form.dayIndex !== null ? visitDays[form.dayIndex] : null

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }))
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) {
      notify('Revise os campos destacados para preparar o pedido.', 'error')
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }
    setConfirmed(true)
    requestAnimationFrame(() => summaryRef.current?.focus())
  }

  const reset = () => {
    setForm(empty)
    setTouched({})
    setSubmitted(false)
    setConfirmed(false)
  }

  const message = useMemo(() => {
    if (!day) return ''
    const lines = [
      `Olá! Quero agendar uma visita na ${brand.fullName}.`,
      `Nome: ${form.name.trim()}`,
      `Objetivo: ${form.goal}`,
      `Modalidade: ${form.modality ? modalityById[form.modality].name : ''}`,
      `Dia e horário: ${formatLongDate(day.date)}, às ${form.time}`,
    ]
    if (form.plan) lines.push(`Plano de interesse: ${planById[form.plan].name} (${form.billing === 'annual' ? 'anual' : 'mensal'})`)
    if (form.note) lines.push(`Aulas de interesse: ${form.note}`)
    return lines.join('\n')
  }, [form, day])

  const errorList = Object.entries(errors)

  return (
    <section id="agendar" className={`section ${styles.section}`} aria-labelledby="visit-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.aside}>
          <MaskText id="visit-title" className="display" lines={['Agende', 'sua visita.']} />
          <p className="lead">Conheça o espaço, faça uma aula experimental e tire dúvidas sobre os planos com a equipe.</p>
          <ol className={styles.steps}>
            <li>
              <strong>Você escolhe dia e horário</strong>
              <span>Os horários aqui são ilustrativos.</span>
            </li>
            <li>
              <strong>Envia o pedido pelo WhatsApp</strong>
              <span>A mensagem já vai pronta. Nada é enviado sem você tocar em enviar.</span>
            </li>
            <li>
              <strong>A equipe confirma</strong>
              <span>O horário só vale depois da confirmação da academia.</span>
            </li>
          </ol>
          <Photo src={`${import.meta.env.BASE_URL}images/com-foco.jpg`} alt="Aluna prendendo o cabelo antes do treino, em ambiente escuro" className={styles.photo} />
        </div>

        <div className={styles.card}>
          <AnimatePresence mode="wait" initial={false}>
            {!confirmed ? (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                className={styles.form}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: ease.out }}
                aria-describedby={`${uid}-privacy`}
              >
                {submitted && errorList.length > 0 && (
                  <div ref={errorRef} tabIndex={-1} className={styles.errorSummary} role="alert">
                    <Icon name="alert" size={18} />
                    <div>
                      <p>Faltam {errorList.length === 1 ? '1 informação' : `${errorList.length} informações`} para preparar o pedido:</p>
                      <ul>
                        {errorList.map(([k, msg]) => (
                          <li key={k}>
                            <a href={`#${uid}-${k}`}>{msg}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {(form.plan || form.note) && (
                  <div className={styles.prefill}>
                    {form.plan && (
                      <p>
                        Plano de interesse: <strong>{planById[form.plan].name}</strong> ({form.billing === 'annual' ? 'anual' : 'mensal'})
                        <button type="button" onClick={() => set('plan', null)} aria-label="Remover plano de interesse">
                          <Icon name="close" size={14} />
                        </button>
                      </p>
                    )}
                    {form.note && (
                      <p>
                        Aulas sinalizadas: <strong>{form.note}</strong>
                        <button type="button" onClick={() => set('note', '')} aria-label="Remover aulas sinalizadas">
                          <Icon name="close" size={14} />
                        </button>
                      </p>
                    )}
                  </div>
                )}

                <div className={styles.field} data-invalid={show('name') ? true : undefined}>
                  <label htmlFor={`${uid}-name`}>Nome</label>
                  <input
                    id={`${uid}-name`}
                    type="text"
                    autoComplete="given-name"
                    maxLength={60}
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    onBlur={() => touch('name')}
                    aria-invalid={Boolean(show('name'))}
                    aria-describedby={show('name') ? `${uid}-name-err` : undefined}
                    placeholder="Como podemos te chamar"
                  />
                  {show('name') && (
                    <p id={`${uid}-name-err`} className={styles.error}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className={styles.field} data-invalid={show('goal') ? true : undefined}>
                  <label htmlFor={`${uid}-goal`}>Objetivo</label>
                  <div className={styles.selectWrap}>
                    <select
                      id={`${uid}-goal`}
                      value={form.goal}
                      onChange={(e) => set('goal', e.target.value)}
                      onBlur={() => touch('goal')}
                      aria-invalid={Boolean(show('goal'))}
                      aria-describedby={show('goal') ? `${uid}-goal-err` : undefined}
                    >
                      <option value="">Selecione</option>
                      {goals.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                    <Icon name="arrowDown" size={16} />
                  </div>
                  {show('goal') && (
                    <p id={`${uid}-goal-err`} className={styles.error}>
                      {errors.goal}
                    </p>
                  )}
                </div>

                <fieldset className={styles.field} id={`${uid}-modality`} data-invalid={show('modality') ? true : undefined}>
                  <legend>Modalidade de interesse</legend>
                  <div className={styles.chips}>
                    {modalities.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className="chip"
                        aria-pressed={form.modality === m.id}
                        onClick={() => {
                          set('modality', m.id)
                          touch('modality')
                        }}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                  {show('modality') && <p className={styles.error}>{errors.modality}</p>}
                </fieldset>

                <fieldset className={styles.field} id={`${uid}-day`} data-invalid={show('day') ? true : undefined}>
                  <legend>Dia desejado</legend>
                  <div className={styles.days}>
                    {visitDays.map((d) => (
                      <button
                        key={d.iso}
                        type="button"
                        className={styles.dayBtn}
                        aria-pressed={form.dayIndex === d.index}
                        aria-label={formatLongDate(d.date)}
                        onClick={() => {
                          setForm((f) => ({ ...f, dayIndex: d.index, time: '' }))
                          touch('day')
                        }}
                      >
                        <span>{d.weekday}</span>
                        <strong>{d.label}</strong>
                      </button>
                    ))}
                  </div>
                  {show('day') && <p className={styles.error}>{errors.day}</p>}
                </fieldset>

                <fieldset className={styles.field} id={`${uid}-time`} data-invalid={show('time') ? true : undefined}>
                  <legend>Horário disponível</legend>
                  {day ? (
                    <div className={styles.chips}>
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          className="chip"
                          aria-pressed={form.time === s.time}
                          disabled={!s.available}
                          aria-label={s.available ? s.time : `${s.time}, indisponível`}
                          onClick={() => {
                            set('time', s.time)
                            touch('time')
                          }}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.hint}>Escolha um dia para ver os horários.</p>
                  )}
                  {show('time') && day && <p className={styles.error}>{errors.time}</p>}
                </fieldset>

                <div className={styles.submitRow}>
                  <Button type="submit" size="lg" icon="arrowRight" block>
                    Preparar pedido de visita
                  </Button>
                  <p id={`${uid}-privacy`} className={styles.privacy}>
                    Nenhum dado sai desta página até você decidir enviar pelo WhatsApp. Nada fica salvo no navegador.
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="done"
                className={styles.done}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: ease.out }}
              >
                <span className={styles.doneIcon} aria-hidden="true">
                  <Icon name="check" size={28} />
                </span>
                <h3 ref={summaryRef} tabIndex={-1} className={styles.doneTitle}>
                  Pedido pronto, {form.name.trim().split(' ')[0]}.
                </h3>
                <p className={styles.doneText}>
                  Ainda não é uma reserva. Envie o resumo pelo WhatsApp e a equipe confirma se o horário está livre.
                </p>

                <dl className={styles.summary}>
                  <div>
                    <dt>Objetivo</dt>
                    <dd>{form.goal}</dd>
                  </div>
                  <div>
                    <dt>Modalidade</dt>
                    <dd>{form.modality && modalityById[form.modality].name}</dd>
                  </div>
                  <div>
                    <dt>Dia e horário</dt>
                    <dd>
                      {day && formatLongDate(day.date)}, às {form.time}
                    </dd>
                  </div>
                  {form.plan && (
                    <div>
                      <dt>Plano de interesse</dt>
                      <dd>
                        {planById[form.plan].name}, {form.billing === 'annual' ? 'anual' : 'mensal'}
                      </dd>
                    </div>
                  )}
                  {form.note && (
                    <div>
                      <dt>Aulas sinalizadas</dt>
                      <dd>{form.note}</dd>
                    </div>
                  )}
                </dl>

                <div className={styles.doneActions}>
                  <Button href={whatsappLink(message)} external size="lg" icon="whatsapp" iconPosition="start">
                    Enviar pedido pelo WhatsApp
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => setConfirmed(false)}>
                    Editar pedido
                  </Button>
                </div>
                {!hasWhatsappNumber() && (
                  <p className={styles.privacy}>
                    Demonstração: o WhatsApp abre com a mensagem pronta para você escolher o contato. Na versão final, ela vai direto para o número da academia.
                  </p>
                )}
                <Button variant="ghost" onClick={reset}>
                  Começar um novo pedido
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
