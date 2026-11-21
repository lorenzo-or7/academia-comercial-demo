import { brand } from '../data/brand'
import styles from './ui.module.css'

/** Logotipo PULSE: marca de batimento + wordmark condensado. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={styles.logo}>
      <svg className={styles.logoMark} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect width="32" height="32" rx="7" fill="var(--signal)" />
        <path
          d="M5 17h6l2.5-7 4 13 3-9 1.5 3H27"
          fill="none"
          stroke="var(--on-signal)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.logoWord}>
        {brand.name}
        {!compact && <span className={styles.logoSub}>{brand.descriptor}</span>}
      </span>
    </span>
  )
}
