import type { ClassSession, DayId, Level, ModalityId } from '../types'

/**
 * Grade semanal DEMONSTRATIVA. Horários, professores e vagas são ilustrativos.
 * Para um cliente real, substitua `weeklyTemplate` (ou carregue de uma API).
 */
export const days: { id: DayId; short: string; long: string }[] = [
  { id: 'seg', short: 'Seg', long: 'Segunda' },
  { id: 'ter', short: 'Ter', long: 'Terça' },
  { id: 'qua', short: 'Qua', long: 'Quarta' },
  { id: 'qui', short: 'Qui', long: 'Quinta' },
  { id: 'sex', short: 'Sex', long: 'Sexta' },
  { id: 'sab', short: 'Sáb', long: 'Sábado' },
]

type Template = [time: string, name: string, modality: ModalityId, min: number, level: Level, cap: number, coach: string]

const weekdayA: Template[] = [
  ['06:30', 'Funcional HIIT', 'funcional', 45, 'Intermediário', 16, 'Rafa'],
  ['07:30', 'Bike Indoor', 'cardio', 45, 'Todos os níveis', 22, 'Bia'],
  ['12:15', 'Core & Mobilidade', 'coletivas', 30, 'Todos os níveis', 18, 'Lia'],
  ['17:30', 'Força Guiada', 'musculacao', 50, 'Iniciante', 10, 'Davi'],
  ['18:30', 'Cross Training', 'funcional', 50, 'Avançado', 16, 'Rafa'],
  ['19:30', 'Ritmos', 'coletivas', 50, 'Todos os níveis', 25, 'Nina'],
  ['20:30', 'Corrida na Esteira', 'cardio', 40, 'Intermediário', 14, 'Bia'],
]

const weekdayB: Template[] = [
  ['06:30', 'Corrida na Esteira', 'cardio', 40, 'Intermediário', 14, 'Bia'],
  ['07:30', 'Pilates Solo', 'coletivas', 50, 'Iniciante', 15, 'Lia'],
  ['12:15', 'Funcional Express', 'funcional', 30, 'Todos os níveis', 16, 'Téo'],
  ['17:30', 'Técnica de Levantamento', 'musculacao', 60, 'Intermediário', 8, 'Davi'],
  ['18:30', 'Bike Indoor', 'cardio', 45, 'Todos os níveis', 22, 'Bia'],
  ['19:30', 'Funcional HIIT', 'funcional', 45, 'Intermediário', 16, 'Téo'],
  ['20:30', 'Alongamento', 'coletivas', 30, 'Todos os níveis', 20, 'Lia'],
]

const saturday: Template[] = [
  ['08:00', 'Cross Training', 'funcional', 60, 'Avançado', 18, 'Rafa'],
  ['09:00', 'Bike Indoor', 'cardio', 45, 'Todos os níveis', 22, 'Bia'],
  ['10:00', 'Força Guiada', 'musculacao', 50, 'Iniciante', 10, 'Davi'],
  ['11:00', 'Ritmos', 'coletivas', 50, 'Todos os níveis', 25, 'Nina'],
]

const templateByDay: Record<DayId, Template[]> = {
  seg: weekdayA,
  ter: weekdayB,
  qua: weekdayA,
  qui: weekdayB,
  sex: weekdayA,
  sab: saturday,
}

/** Ocupação determinística (sempre a mesma a cada carregamento). */
function seededBooked(key: string, capacity: number) {
  let h = 0
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const ratio = (h % 100) / 100
  // Algumas turmas cheias, a maioria com vagas
  if (ratio > 0.9) return capacity
  return Math.round(capacity * (0.25 + ratio * 0.7))
}

export const classSessions: ClassSession[] = days.flatMap(({ id: day }) =>
  templateByDay[day].map(([time, name, modality, durationMin, level, capacity, coach]) => {
    const id = `${day}-${time.replace(':', '')}`
    return {
      id,
      day,
      time,
      name,
      modality,
      durationMin,
      level,
      capacity,
      booked: seededBooked(id + name, capacity),
      coach,
    }
  }),
)
