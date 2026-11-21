import { annualDiscount } from '../data/plans'
import type { Billing, Plan } from '../types'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatBRL = (value: number) => brl.format(value)

const round2 = (n: number) => Math.round(n * 100) / 100

/** Valor mensal efetivo para o tipo de cobrança. */
export function monthlyPrice(plan: Plan, billing: Billing) {
  return billing === 'annual' ? round2(plan.monthly * (1 - annualDiscount)) : plan.monthly
}

/** Total pago em 12 meses e economia em relação ao mensal. */
export function yearlyTotals(plan: Plan) {
  const annualMonthly = monthlyPrice(plan, 'annual')
  const annualTotal = round2(annualMonthly * 12)
  const monthlyTotal = round2(plan.monthly * 12)
  return { annualMonthly, annualTotal, savings: round2(monthlyTotal - annualTotal) }
}

/** Separa "R$ 169,90" em partes para tipografia: inteiro e centavos. */
export function priceParts(value: number) {
  const [int, cents] = value.toFixed(2).split('.')
  return { int: Number(int).toLocaleString('pt-BR'), cents }
}
