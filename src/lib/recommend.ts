import { quizQuestions } from '../data/quiz'
import type { PlanId, QuizAnswers } from '../types'

/**
 * LÓGICA DO SIMULADOR (determinística)
 *
 * 1. Cada resposta soma os pontos definidos em `data/quiz.ts` para os planos.
 * 2. Regra de elegibilidade: quem precisa de horário flexível
 *    (flexibility = "flexible") não recebe o Essential, que só dá acesso
 *    até 16h nos dias úteis.
 * 3. Vence o plano elegível com mais pontos.
 * 4. Empate: vence o plano mais barato entre os empatados
 *    (essential < performance < unlimited). A recomendação nunca empurra
 *    para cima quando não há motivo nas respostas.
 *
 * Exemplo: força + 3-4x + musculação + horário diurno
 *   essential 2+0+2+2 = 6, performance 1+2+0+0 = 3 → Essential.
 */
const priceOrder: PlanId[] = ['essential', 'performance', 'unlimited']

export interface Recommendation {
  plan: PlanId
  scores: Record<PlanId, number>
  reasons: string[]
}

export function recommendPlan(answers: QuizAnswers): Recommendation {
  const scores: Record<PlanId, number> = { essential: 0, performance: 0, unlimited: 0 }

  for (const q of quizQuestions) {
    const opt = q.options.find((o) => o.id === answers[q.id])
    if (!opt) continue
    for (const [plan, pts] of Object.entries(opt.scores) as [PlanId, number][]) scores[plan] += pts
  }

  const eligible = priceOrder.filter((p) => !(p === 'essential' && answers.flexibility === 'flexible'))
  const plan = eligible.reduce((best, p) => (scores[p] > scores[best] ? p : best), eligible[0])

  return { plan, scores, reasons: buildReasons(plan, answers) }
}

function buildReasons(plan: PlanId, a: QuizAnswers): string[] {
  const r: string[] = []
  if (a.flexibility === 'flexible') r.push('Você precisa de horário livre, inclusive à noite.')
  if (a.flexibility === 'daytime' && plan === 'essential')
    r.push('Seu horário cabe no acesso diurno, que tem o menor preço.')
  if (a.frequency === 'high') r.push('Com 5 treinos ou mais por semana, aulas sem limite compensam.')
  if (a.frequency === 'mid') r.push('3 a 4 treinos por semana combinam com até 8 aulas no mês.')
  if (a.frequency === 'low') r.push('Com 1 a 2 treinos por semana, um plano enxuto evita pagar pelo que não vai usar.')
  if (a.preference === 'classes' && plan !== 'essential') r.push('Aulas coletivas e funcionais estão incluídas.')
  if (a.preference === 'mix' && plan !== 'essential') r.push('Você alterna salão de musculação e aulas.')
  if (a.preference === 'weights' && plan === 'essential') r.push('Musculação e cardio cobrem o que você quer fazer.')
  if (a.goal === 'variety' && plan === 'unlimited') r.push('Variedade e treino em grupo pedem acesso a toda a grade.')
  return r.slice(0, 3)
}
