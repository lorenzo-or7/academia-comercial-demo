import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { navItems } from '../data/brand'
import { useActiveSection, useBodyLock, useFocusTrap, useScrolled, type Theme } from '../hooks'
import { ease, scrollToId } from '../lib/motion'
import { Button } from './Button'
import { Icon } from './Icon'
import { Logo } from './Logo'
import styles from './Navbar.module.css'

const ids = navItems.map((n) => n.id)

export function Navbar({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const scrolled = useScrolled(40)
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const sheetRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useBodyLock(open)
  useFocusTrap(sheetRef, open, close)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => mq.matches && setOpen(false)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // aguarda o menu fechar para não brigar com o lock de rolagem
    requestAnimationFrame(() => scrollToId(id))
    history.replaceState(null, '', `#${id}`)
  }

  const themeLabel = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'

  return (
    <>
      <header className={styles.wrap} data-scrolled={scrolled || undefined}>
        <motion.nav
          className={`${styles.bar} ${scrolled ? '' : 'on-dark'}`}
          aria-label="Principal"
          initial={reduce ? false : { y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: ease.out, delay: 0.9 }}
        >
          <a href="#topo" className={styles.brand} onClick={go('topo')} aria-label="PULSE, voltar ao início">
            <Logo compact />
          </a>

          <ul className={styles.links}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className={styles.link}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                  {active === item.id && (
                    <motion.span layoutId="nav-active" className={styles.indicator} transition={{ duration: 0.3, ease: ease.out }} />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.themeBtn}`}
              onClick={onToggleTheme}
              aria-label={themeLabel}
              title={themeLabel}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -60, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 60, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'grid' }}
                >
                  <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                </motion.span>
              </AnimatePresence>
            </button>
            <Button href="#agendar" size="sm" className={styles.cta} onClick={go('agendar')} magnetic>
              Começar<span className={styles.ctaExtra}> agora</span>
            </Button>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.menuBtn}`}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" />
              <span className="sr-only">Abrir menu</span>
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={sheetRef}
            id="menu-mobile"
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: ease.inOut }}
          >
            <div className={styles.sheetTop}>
              <Logo />
              <button type="button" className={styles.iconBtn} onClick={close} aria-label="Fechar menu" data-autofocus>
                <Icon name="close" />
              </button>
            </div>
            <ul className={styles.sheetLinks}>
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={reduce ? false : { y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: ease.out, delay: 0.18 + i * 0.05 }}
                >
                  <a href={`#${item.id}`} onClick={go(item.id)} aria-current={active === item.id ? 'true' : undefined}>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className={styles.sheetFoot}>
              <Button href="#agendar" onClick={go('agendar')} icon="arrowRight" block size="lg">
                Agendar visita
              </Button>
              <Button href="#simulador" onClick={go('simulador')} variant="secondary" block size="lg">
                Descobrir meu plano
              </Button>
              <button type="button" className={styles.sheetTheme} onClick={onToggleTheme}>
                <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
                {themeLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
