import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { MaskText } from '../components/Reveal'
import { useApp } from '../context/AppContext'
import { modalityById } from '../data/modalities'
import { annualDiscount, billingTerms, comparison, plans } from '../data/plans'
import { ease } from '../lib/motion'
import { formatBRL, monthlyPrice, priceParts, yearlyTotals } from '../lib/pricing'
import type { Billing, PlanId } from '../types'
import styles from './Plans.module.css'

function Price({ value }: { value: number }) {
  const { int, cents } = priceParts(value)
  return (
    <span className={styles.price}>
      <span className={styles.currency}>R$</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className={styles.amount}
          initial={{ y: '60%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-60%', opacity: 0 }}
          transition={{ duration: 0.32, ease: ease.out }}
        >
          {int}
          <span className={styles.cents}>,{cents}</span>
        </motion.span>
      </AnimatePresence>
      <span className={styles.per}>/mês</span>
    </span>
  )
}

function Cell({ v }: { v: string | boolean }) {
  if (v === true)
    return (
      <>
        <Icon name="check" size={20} className={styles.yes} />
        <span className="sr-only">Incluído</span>
      </>
    )
  if (v === false)
    return (
      <>
        <span className={styles.no} aria-hidden="true">—</span>
        <span className="sr-only">Não incluído</span>
      </>
    )
  return <>{v}</>
}

export function Plans() {
  const { billing, setBilling, selectedPlan, setSelectedPlan, requestVisit } = useApp()
  const [compareOpen, setCompareOpen] = useState(false)
  const selected = plans.find((p) => p.id === selectedPlan)!
  const pct = Math.round(annualDiscount * 100)

  const startEnrollment = (id: PlanId) => requestVisit({ plan: id, billing })

  return (
    <section id="planos" className={`section ${styles.section}`} aria-labelledby="planos-title">
      <div className="container">
        <header className="section-head">
          <MaskText id="planos-title" className="display" lines={['Escolha', 'seu plano.']} />
          <div className={styles.headSide}>
            <p className="lead">Três planos, sem taxa escondida. Compare o que cada um inclui e escolha como prefere pagar.</p>
            <p className="demo-tag">Preços e condições demonstrativos</p>
          </div>
        </header>

        <div className={styles.billing}>
          <div className={styles.toggle} role="group" aria-label="Forma de cobrança">
            {(['monthly', 'annual'] as Billing[]).map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={billing === b}
                className={styles.toggleBtn}
                onClick={() => setBilling(b)}
              >
                <span>{b === 'monthly' ? 'Mensal' : 'Anual'}</span>
                {b === 'annual' && <span className={styles.save}>−{pct}%</span>}
                {billing === b && (
                  <motion.span layoutId="billing-pill" className={styles.togglePill} transition={{ duration: 0.3, ease: ease.out }} />
                )}
              </button>
            ))}
          </div>
          <p className={styles.terms}>{billingTerms[billing]}</p>
        </div>

        <div className={styles.grid} role="group" aria-label="Escolha de plano">
          {plans.map((p) => {
            const isSel = selectedPlan === p.id
            const { annualTotal, savings } = yearlyTotals(p)
            return (
              <article key={p.id} className={styles.card} data-highlight={p.highlight || undefined} data-selected={isSel || undefined}>
                {isSel && <motion.span layoutId="plan-ring" className={styles.ring} transition={{ duration: 0.4, ease: ease.inOut }} aria-hidden="true" />}
                {p.highlight && <p className={styles.flag}>Plano em destaque</p>}

                <button
                  type="button"
                  aria-pressed={isSel}
                  className={styles.select}
                  onClick={() => setSelectedPlan(p.id)}
                >
                  <span className={styles.radio} aria-hidden="true">
                    {isSel && <motion.span layoutId="plan-dot" className={styles.radioDot} />}
                  </span>
                  <span className={styles.planName}>{p.name}</span>
                  <span className="sr-only">
                    , {formatBRL(monthlyPrice(p, billing))} por mês
                  </span>
                </button>

                <p className={styles.tagline}>{p.tagline}</p>

                <div className={styles.priceBlock}>
                  <Price value={monthlyPrice(p, billing)} />
                  <p className={styles.priceNote}>
                    {billing === 'annual'
                      ? `${formatBRL(annualTotal)} em 12 meses. Economia de ${formatBRL(savings)} sobre o mensal.`
                      : `Ou ${formatBRL(monthlyPrice(p, 'annual'))}/mês no anual.`}
                  </p>
                </div>

                <ul className={styles.benefits}>
                  {p.benefits.map((b) => (
                    <li key={b}>
                      <Icon name="check" size={18} />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className={styles.mods}>
                  <p className={styles.modsLabel}>Modalidades</p>
                  <p>{p.modalities.map((m) => modalityById[m].name).join(', ')}</p>
                </div>

                <p className={styles.condition}>{p.conditions[0]}</p>

                <Button
                  block
                  variant={isSel ? 'primary' : 'secondary'}
                  icon="arrowRight"
                  onClick={() => {
                    setSelectedPlan(p.id)
                    startEnrollment(p.id)
                  }}
                >
                  Começar com {p.name}
                </Button>
              </article>
            )
          })}
        </div>

        <div className={styles.summary} aria-live="polite">
          <p>
            Selecionado: <strong>{selected.name}</strong>, {billing === 'annual' ? 'anual' : 'mensal'},{' '}
            <strong>{formatBRL(monthlyPrice(selected, billing))}/mês</strong>
          </p>
          <div className={styles.summaryActions}>
            <Button
              variant="ghost"
              aria-expanded={compareOpen}
              aria-controls="comparativo"
              onClick={() => setCompareOpen((v) => !v)}
            >
              {compareOpen ? 'Ocultar comparativo' : 'Comparar planos em detalhe'}
            </Button>
            <Button magnetic icon="arrowRight" onClick={() => startEnrollment(selected.id)}>
              Iniciar matrícula
            </Button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {compareOpen && (
            <motion.div
              id="comparativo"
              className={styles.compareWrap}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: ease.out }}
            >
              <table className={styles.compare}>
                <caption className="sr-only">Comparativo entre os planos</caption>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">Recurso</span>
                    </th>
                    {plans.map((p) => (
                      <th key={p.id} scope="col" data-selected={selectedPlan === p.id || undefined}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature}>
                      <th scope="row">{row.feature}</th>
                      {plans.map((p) => (
                        <td key={p.id} data-selected={selectedPlan === p.id || undefined} data-plan={p.name}>
                          <Cell v={row.values[p.id]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
