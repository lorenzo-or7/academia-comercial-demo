import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import { ease } from '../lib/motion'
import { Icon } from './Icon'
import styles from './ui.module.css'

export function Toaster() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className={styles.toaster} role="status" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            className={styles.toast}
            data-tone={t.tone}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
            transition={{ duration: 0.28, ease: ease.out }}
          >
            <Icon name={t.tone === 'error' ? 'alert' : 'check'} size={18} />
            <p>{t.message}</p>
            <button type="button" onClick={() => dismissToast(t.id)} aria-label="Fechar aviso">
              <Icon name="close" size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
