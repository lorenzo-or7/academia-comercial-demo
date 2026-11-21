import type { ComparisonRow, Plan, PlanId } from '../types'

/**
 * Planos DEMONSTRATIVOS. Os valores anuais são calculados a partir do mensal
 * em `lib/pricing.ts` usando `annualDiscount`, então basta alterar aqui.
 */
export const annualDiscount = 0.15

export const plans: Plan[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Para quem quer começar pela musculação.',
    monthly: 119.9,
    modalities: ['musculacao', 'cardio'],
    benefits: [
      'Musculação e cardio',
      'Treino inicial montado por instrutor',
      'Reavaliação física a cada 3 meses',
    ],
    conditions: ['Acesso das 5h às 16h nos dias úteis e livre aos sábados'],
  },
  {
    id: 'performance',
    name: 'Performance',
    tagline: 'Treino completo, em qualquer horário.',
    monthly: 169.9,
    modalities: ['musculacao', 'cardio', 'funcional', 'coletivas'],
    benefits: [
      'Todas as modalidades',
      'Até 8 aulas coletivas ou funcionais por mês',
      'Reavaliação física a cada 2 meses',
    ],
    conditions: ['Acesso em todo o horário de funcionamento'],
    highlight: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    tagline: 'Para quem treina quase todo dia.',
    monthly: 229.9,
    modalities: ['musculacao', 'cardio', 'funcional', 'coletivas'],
    benefits: [
      'Aulas coletivas e funcionais sem limite',
      '1 sessão individual com instrutor por mês',
      'Reavaliação mensal e 2 convidados por mês',
    ],
    conditions: ['Acesso em todo o horário de funcionamento'],
  },
]

export const planById = Object.fromEntries(plans.map((p) => [p.id, p])) as Record<PlanId, Plan>

export const billingTerms = {
  monthly: 'Mensal sem fidelidade. Cancele quando quiser, com aviso de 30 dias.',
  annual: `Anual com ${Math.round(annualDiscount * 100)}% de desconto sobre o mensal, em 12 parcelas e compromisso de 12 meses.`,
}

export const comparison: ComparisonRow[] = [
  { feature: 'Musculação e cardio', values: { essential: true, performance: true, unlimited: true } },
  {
    feature: 'Horário de acesso',
    values: { essential: '5h–16h dias úteis', performance: 'Livre', unlimited: 'Livre' },
  },
  { feature: 'Treino funcional', values: { essential: false, performance: true, unlimited: true } },
  {
    feature: 'Aulas coletivas',
    values: { essential: false, performance: 'Até 8/mês', unlimited: 'Sem limite' },
  },
  {
    feature: 'Reavaliação física',
    values: { essential: 'Trimestral', performance: 'Bimestral', unlimited: 'Mensal' },
  },
  {
    feature: 'Sessão individual com instrutor',
    values: { essential: false, performance: false, unlimited: '1/mês' },
  },
  { feature: 'Convidados', values: { essential: false, performance: false, unlimited: '2/mês' } },
]
