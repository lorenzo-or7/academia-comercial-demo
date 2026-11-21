import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Icon } from '../components/Icon'
import { MaskText } from '../components/Reveal'
import { faq } from '../data/content'
import { ease } from '../lib/motion'
import styles from './Faq.module.css'

export function Faq() {
  const [open, setOpen] = useState<string | null>(faq[0].id)

  return (
    <section id="faq" className={`section ${styles.section}`} aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.head}>
          <MaskText id="faq-title" className="display" lines={['Perguntas', 'frequentes.']} />
          <p className="demo-tag">Respostas demonstrativas, ajustáveis para cada academia</p>
        </div>

        <div className={styles.list}>
          {faq.map((item) => {
            const isOpen = open === item.id
            return (
              <div key={item.id} className={styles.item} data-open={isOpen || undefined}>
                <h3>
                  <button
                    type="button"
                    id={`faq-btn-${item.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className={styles.trigger}
                  >
                    <span>{item.question}</span>
                    <span className={styles.icon} aria-hidden="true">
                      <Icon name="plus" size={20} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${item.id}`}
                      className={styles.panel}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: ease.out }}
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
