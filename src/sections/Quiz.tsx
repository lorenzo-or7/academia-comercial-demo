import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from "react"
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { MaskText } from '../components/Reveal'
import { useApp } from '../context/AppContext'
import { planById } from '../data/plans'
import { quizQuestions } from '../data/quiz'
import { ease } from '../lib/motion'
import { formatBRL } from '../lib/pricing'
import { recommendPlan } from '../lib/recommend'
import type { QuizAnswers } from '../types'
import styles from './Quiz.module.css'

const total = quizQuestions.length

export function Quiz() {
  const { requestVisit, showPlan } = useApp()
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0) // 0..total-1 perguntas, total = resultado
  const [dir, setDir] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const headingRef = useRef<HTMLHeadingElement>(null)
  const started = useRef(false)

  const done = step >= total
  const q = quizQuestions[Math.min(step, total - 1)]
  const result = done ? recommendPlan(answers) : null

  const advancing = useRef(false)
  // move o foco para o novo título quando a etapa termina de entrar (não na montagem)
  const focusHeading = (definition: unknown) => {
    if (definition === "center" && started.current) headingRef.current?.focus({ preventScroll: true })
  }

  const choose = (optionId: string) => {
    if (advancing.current) return
    advancing.current = true
    started.current = true
    setAnswers((a) => ({ ...a, [q.id]: optionId }))
    setDir(1)
    window.setTimeout(() => {
      setStep((s) => s + 1)
      advancing.current = false
    }, reduce ? 0 : 160)
  }

  const back = () => {
    started.current = true
    setDir(-1)
    setStep((s) => Math.max(0, s - 1))
  }

  const restart = () => {
    started.current = true
    setDir(-1)
    setAnswers({})
    setStep(0)
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -40 }),
  }

  const plan = result ? planById[result.plan] : null

  return (
    <section id="simulador" className={`section ${styles.section}`} aria-labelledby="quiz-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <MaskText id="quiz-title" className="display" lines={['Qual plano', 'combina', 'com você?']} />
          <p className="lead">Quatro perguntas rápidas. A sugestão leva em conta objetivo, frequência e horário.</p>
          <p className={styles.note}>
            Sugestão comercial baseada nas suas respostas. Não substitui orientação de um profissional de educação física ou de saúde.
          </p>
        </div>

        <div className={styles.panel}>
          <div className={styles.progress} aria-hidden="true">
            {quizQuestions.map((_, i) => (
              <span key={i} data-on={i < step || done || undefined} data-current={i === step || undefined} />
            ))}
          </div>

          <AnimatePresence mode="wait" custom={dir} initial={false}>
            {!done ? (
              <motion.div
                key={q.id}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: ease.out }}
                className={styles.stepBody}
                onAnimationComplete={focusHeading}
              >
                <p className={styles.count}>
                  Pergunta {step + 1} de {total}
                </p>
                <h3 ref={headingRef} tabIndex={-1} className={styles.question} id={`q-${q.id}`}>
                  {q.title}
                </h3>
                <div className={styles.options} role="group" aria-labelledby={`q-${q.id}`}>
                  {q.options.map((o) => {
                    const sel = answers[q.id] === o.id
                    return (
                      <button
                        key={o.id}
                        type="button"
                        className={styles.option}
                        aria-pressed={sel}
                        onClick={() => choose(o.id)}
                      >
                        <span className={styles.optionMark} aria-hidden="true">
                          {sel && <Icon name="check" size={16} />}
                        </span>
                        <span className={styles.optionText}>
                          {o.label}
                          {o.hint && <small>{o.hint}</small>}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className={styles.nav}>
                  {step > 0 ? (
                    <Button variant="ghost" icon="arrowLeft" iconPosition="start" onClick={back}>
                      Voltar
                    </Button>
                  ) : (
                    <span />
                  )}
                  {answers[q.id] && (
                    <Button variant="secondary" size="sm" icon="arrowRight" onClick={() => setStep((s) => s + 1)}>
                      Manter resposta e seguir
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              result &&
              plan && (
                <motion.div
                  key="result"
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: ease.out }}
                  className={styles.stepBody}
                onAnimationComplete={focusHeading}
                >
                  <p className={styles.count}>Sua sugestão</p>
                  <h3 ref={headingRef} tabIndex={-1} className={styles.resultName}>
                    <span className="sr-only">Plano recomendado: </span>
                    {plan.name}
                  </h3>
                  <p className={styles.resultPrice}>A partir de {formatBRL(plan.monthly)}/mês no mensal</p>

                  {result.reasons.length > 0 && (
                    <ul className={styles.reasons}>
                      {result.reasons.map((r) => (
                        <li key={r}>
                          <Icon name="check" size={18} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  <dl className={styles.answers}>
                    {quizQuestions.map((qq) => (
                      <div key={qq.id}>
                        <dt>{qq.title}</dt>
                        <dd>{qq.options.find((o) => o.id === answers[qq.id])?.label}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className={styles.resultActions}>
                    <Button icon="arrowRight" magnetic onClick={() => requestVisit({ plan: plan.id })}>
                      Iniciar matrícula no {plan.name}
                    </Button>
                    <Button variant="secondary" onClick={() => showPlan(plan.id)}>
                      Ver detalhes do plano
                    </Button>
                  </div>
                  <div className={styles.nav}>
                    <Button variant="ghost" icon="arrowLeft" iconPosition="start" onClick={back}>
                      Voltar
                    </Button>
                    <Button variant="ghost" icon="refresh" iconPosition="start" onClick={restart}>
                      Refazer simulação
                    </Button>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
