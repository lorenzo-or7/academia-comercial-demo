/**
 * Datas e horários ILUSTRATIVOS para o agendamento de visita.
 * Não há disponibilidade real: os horários marcados como ocupados
 * são derivados da data para manter a demonstração estável.
 */
export interface VisitDay {
  index: number
  date: Date
  iso: string
  weekday: string
  label: string
}

const weekdayFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
const dayFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })
const longFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

export function upcomingVisitDays(count = 6, from = new Date()): VisitDay[] {
  const out: VisitDay[] = []
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  while (out.length < count) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() === 0) continue // domingo fechado
    const date = new Date(d)
    out.push({
      index: out.length,
      date,
      iso: date.toISOString().slice(0, 10),
      weekday: weekdayFmt.format(date).replace('.', ''),
      label: dayFmt.format(date),
    })
  }
  return out
}

export const formatLongDate = (d: Date) => longFmt.format(d)

const weekdaySlots = ['07:00', '09:00', '11:00', '14:00', '17:00', '19:00']
const saturdaySlots = ['09:00', '10:00', '11:00', '14:00']

export interface Slot {
  time: string
  available: boolean
}

export function slotsFor(day: VisitDay): Slot[] {
  const base = day.date.getDay() === 6 ? saturdaySlots : weekdaySlots
  return base.map((time, i) => ({
    time,
    // padrão determinístico de horários ocupados
    available: (day.date.getDate() + i * 3) % 5 !== 0,
  }))
}
