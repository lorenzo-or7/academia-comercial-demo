/** Curvas e durações compartilhadas por todo o motion do site. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
  snap: [0.32, 0.72, 0, 1] as const,
}

export const dur = {
  ui: 0.22,
  uiSlow: 0.32,
  reveal: 0.75,
  revealSlow: 0.9,
}

export function scrollToId(id: string, opts: { focus?: boolean } = {}) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  if (opts.focus !== false) {
    const target = el.querySelector<HTMLElement>('[data-focus-target]') ?? el
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
}
