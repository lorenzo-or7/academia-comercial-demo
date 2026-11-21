export type ModalityId = 'musculacao' | 'funcional' | 'cardio' | 'coletivas'
export type PlanId = 'essential' | 'performance' | 'unlimited'
export type Billing = 'monthly' | 'annual'
export type DayId = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab'
export type Level = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Todos os níveis'

export interface Modality {
  id: ModalityId
  name: string
  /** Frase curta usada no painel fechado */
  focus: string
  description: string
  benefits: string[]
  image: string
  imageAlt: string
  /** Rótulo de formato exibido no painel aberto */
  format: string
}

export interface Facility {
  id: string
  title: string
  description: string
  image: string
  alt: string
}

export interface ClassSession {
  id: string
  day: DayId
  time: string
  name: string
  modality: ModalityId
  durationMin: number
  level: Level
  capacity: number
  booked: number
  coach: string
}

export interface Plan {
  id: PlanId
  name: string
  tagline: string
  /** Preço mensal sem compromisso, em reais */
  monthly: number
  benefits: string[]
  modalities: ModalityId[]
  conditions: string[]
  highlight?: boolean
}

export interface ComparisonRow {
  feature: string
  values: Record<PlanId, string | boolean>
}

export interface QuizOption {
  id: string
  label: string
  hint?: string
  scores: Partial<Record<PlanId, number>>
}

export interface QuizQuestion {
  id: 'goal' | 'frequency' | 'preference' | 'flexibility'
  title: string
  options: QuizOption[]
}

export type QuizAnswers = Partial<Record<QuizQuestion['id'], string>>

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface VisitPrefill {
  modality?: ModalityId
  plan?: PlanId
  billing?: Billing
  dayIndex?: number
  note?: string
}
