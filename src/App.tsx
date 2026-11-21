import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Logo } from './components/Logo'
import { Navbar } from './components/Navbar'
import { Toaster } from './components/Toaster'
import { AppProvider } from './context/AppContext'
import { useTheme } from './hooks'
import { ease } from './lib/motion'
import { Community } from './sections/Community'
import { Facilities } from './sections/Facilities'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Modalities } from './sections/Modalities'
import { Plans } from './sections/Plans'
import { Quiz } from './sections/Quiz'
import { Schedule } from './sections/Schedule'
import { Visit } from './sections/Visit'

/** Premium Page Entry: cortina curta com a marca, sincronizada com a hero. */
function EntryCurtain() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(!reduce)
  useEffect(() => {
    if (!show) return
    const t = window.setTimeout(() => setShow(false), 650)
    return () => window.clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="entry-curtain"
          aria-hidden="true"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: ease.inOut }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: ease.out }}
          >
            <Logo />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <EntryCurtain />
        <Navbar theme={theme} onToggleTheme={toggle} />
        <main id="conteudo" tabIndex={-1}>
          <Hero />
          <Manifesto />
          <Modalities />
          <Facilities />
          <Schedule />
          <Plans />
          <Quiz />
          <Community />
          <Visit />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <Toaster />
      </AppProvider>
    </MotionConfig>
  )
}
