import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { scrollToId } from '../lib/motion'
import type { Billing, ModalityId, PlanId, VisitPrefill } from '../types'

export interface Toast {
  id: number
  message: string
  tone: 'info' | 'success' | 'error'
}

interface AppState {
  /** Filtro de modalidade compartilhado entre Modalidades e Grade de aulas */
  scheduleModality: ModalityId | 'all'
  showSchedule: (m: ModalityId | 'all') => void
  setScheduleModality: (m: ModalityId | 'all') => void

  /** Aulas sinalizadas na grade (apenas em memória, nada é enviado) */
  interests: string[]
  toggleInterest: (id: string) => void

  /** Plano escolhido na seção de planos */
  selectedPlan: PlanId
  setSelectedPlan: (p: PlanId) => void
  billing: Billing
  setBilling: (b: Billing) => void
  showPlan: (p: PlanId) => void

  /** Pré-preenchimento do agendamento */
  visitPrefill: VisitPrefill & { stamp: number }
  requestVisit: (prefill?: VisitPrefill) => void

  toasts: Toast[]
  notify: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [scheduleModality, setScheduleModality] = useState<ModalityId | 'all'>('all')
  const [interests, setInterests] = useState<string[]>([])
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('performance')
  const [billing, setBilling] = useState<Billing>('monthly')
  const [visitPrefill, setVisitPrefill] = useState<VisitPrefill & { stamp: number }>({ stamp: 0 })
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const notify = useCallback(
    (message: string, tone: Toast['tone'] = 'info') => {
      const id = ++toastId.current
      setToasts((t) => [...t.slice(-2), { id, message, tone }])
      window.setTimeout(() => dismissToast(id), 5200)
    },
    [dismissToast],
  )

  const showSchedule = useCallback((m: ModalityId | 'all') => {
    setScheduleModality(m)
    scrollToId('aulas')
  }, [])

  const toggleInterest = useCallback((id: string) => {
    setInterests((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
  }, [])

  const showPlan = useCallback((p: PlanId) => {
    setSelectedPlan(p)
    scrollToId('planos')
  }, [])

  const requestVisit = useCallback((prefill: VisitPrefill = {}) => {
    setVisitPrefill({ ...prefill, stamp: Date.now() })
    scrollToId('agendar')
  }, [])

  const value = useMemo<AppState>(
    () => ({
      scheduleModality,
      showSchedule,
      setScheduleModality,
      interests,
      toggleInterest,
      selectedPlan,
      setSelectedPlan,
      billing,
      setBilling,
      showPlan,
      visitPrefill,
      requestVisit,
      toasts,
      notify,
      dismissToast,
    }),
    [scheduleModality, showSchedule, interests, toggleInterest, selectedPlan, billing, showPlan, visitPrefill, requestVisit, toasts, notify, dismissToast],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp precisa estar dentro de <AppProvider>')
  return v
}
