import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { MaskText } from '../components/Reveal'
import { brand } from '../data/brand'
import { ease, scrollToId } from '../lib/motion'
import styles from './Hero.module.css'

/** Atraso de entrada, sincronizado com a cortina de abertura do App. */
const D = 0.55

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // parallax contido: no máximo 10% da altura
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '10%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0.15])

  return (
    <section ref={ref} id="topo" className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
      <motion.div
        className={styles.media}
        initial={reduce ? false : { clipPath: 'inset(18% 12% 18% 12% round 24px)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
        transition={{ duration: 1.25, ease: ease.inOut, delay: D }}
      >
        <motion.div className={styles.mediaInner} style={{ y: mediaY }}>
          <motion.img
            src={`${import.meta.env.BASE_URL}images/hero.jpg`}
            alt="Atleta segurando uma barra olímpica carregada no início de um levantamento terra, vista de baixo"
            initial={reduce ? false : { scale: 1.25 }}
            animate={{ scale: 1.04 }}
            transition={{ duration: 1.8, ease: ease.out, delay: D }}
          />
        </motion.div>
        <div className={styles.scrim} aria-hidden="true" />
      </motion.div>

      <motion.div className={`container ${styles.content}`} style={{ opacity: contentOpacity }}>
        <motion.p
          className={styles.meta}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: ease.out, delay: D + 1.1 }}
        >
          <Icon name="clock" size={16} />
          <span>
            {brand.hours[0].days}, {brand.hours[0].time}
          </span>
          <span className={styles.metaDemo}>horário ilustrativo</span>
        </motion.p>

        <MaskText
          as="h1"
          id="hero-title"
          className={styles.title}
          lines={['Seu próximo', 'nível começa', 'aqui.']}
          immediate
          delay={D + 0.55}
        />

        <svg className={styles.pulse} viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
          <motion.path
            className="pulse-path"
            d="M0 24h250l14-18 18 32 16-26 10 12h292"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: ease.inOut, delay: D + 1.05 }}
          />
        </svg>

        <motion.div
          className={styles.bottom}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: ease.out, delay: D + 1.2 }}
        >
          <p className={styles.lead}>Treine com estrutura, orientação e energia para superar seus próprios limites.</p>
          <div className={styles.ctas}>
            <Button size="lg" icon="arrowRight" magnetic onClick={() => scrollToId('planos')}>
              Conhecer planos
            </Button>
            <Button size="lg" variant="onPhoto" onClick={() => scrollToId('estrutura')}>
              Explorar academia
            </Button>
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#manifesto"
        className={styles.scroll}
        onClick={(e) => {
          e.preventDefault()
          scrollToId('manifesto')
        }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: D + 1.6 }}
      >
        <span className={styles.scrollTrack} aria-hidden="true">
          <span className={styles.scrollThumb} />
        </span>
        <span>Role para conhecer</span>
      </motion.a>
    </section>
  )
}
