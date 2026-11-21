import type { QuizQuestion } from '../types'

/**
 * Perguntas do simulador. Cada opção soma pontos para um ou mais planos.
 * A regra completa está documentada em `lib/recommend.ts`.
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'goal',
    title: 'Qual seu principal objetivo?',
    options: [
      { id: 'strength', label: 'Ganhar força e massa muscular', scores: { essential: 2, performance: 1 } },
      { id: 'conditioning', label: 'Melhorar fôlego e condicionamento', scores: { performance: 2, unlimited: 1 } },
      { id: 'health', label: 'Sair do sedentarismo com constância', scores: { essential: 2, performance: 1 } },
      { id: 'variety', label: 'Variar os treinos e treinar em grupo', scores: { unlimited: 2, performance: 1 } },
    ],
  },
  {
    id: 'frequency',
    title: 'Quantas vezes pretende treinar por semana?',
    options: [
      { id: 'low', label: '1 a 2 vezes', scores: { essential: 2 } },
      { id: 'mid', label: '3 a 4 vezes', scores: { performance: 2 } },
      { id: 'high', label: '5 vezes ou mais', scores: { unlimited: 2, performance: 1 } },
    ],
  },
  {
    id: 'preference',
    title: 'Prefere musculação ou aulas?',
    options: [
      { id: 'weights', label: 'Musculação, no meu ritmo', scores: { essential: 2 } },
      { id: 'mix', label: 'Um pouco de cada', scores: { performance: 2 } },
      { id: 'classes', label: 'Aulas com professor e turma', scores: { unlimited: 2, performance: 1 } },
    ],
  },
  {
    id: 'flexibility',
    title: 'Procura flexibilidade de horários?',
    options: [
      {
        id: 'daytime',
        label: 'Não, treino de manhã ou até o meio da tarde',
        hint: 'Dias úteis até 16h',
        scores: { essential: 2 },
      },
      {
        id: 'flexible',
        label: 'Sim, preciso treinar à noite ou em horários variados',
        scores: { performance: 1, unlimited: 1 },
      },
    ],
  },
]
