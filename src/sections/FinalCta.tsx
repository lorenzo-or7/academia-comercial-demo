import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { MaskText } from '../components/Reveal'
import { useApp } from '../context/AppContext'
import { brand } from '../data/brand'
import { scrollToId } from '../lib/motion'
import { whatsappLink } from '../lib/whatsapp'
import styles from './FinalCta.module.css'

export function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { requestVisit } = useApp()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])

  return (
    <section ref={ref} id="contato" className={`${styles.section} on-dark`} aria-labelledby="final-title">
      <div className={styles.media} aria-hidden="true">
        <motion.img src={`${import.meta.env.BASE_URL}images/final.jpg`} alt="" loading="lazy" style={{ y }} />
        <div className={styles.scrim} />
      </div>

      <div className={`container ${styles.inner}`}>
        <MaskText id="final-title" className={styles.title} lines={['O próximo', 'passo é seu.']} />

        <div className={styles.actions}>
          <Button size="lg" icon="arrowRight" magnetic onClick={() => scrollToId('planos')}>
            Conhecer planos
          </Button>
          <Button size="lg" variant="onPhoto" onClick={() => requestVisit()}>
            Agendar visita
          </Button>
          <Button
            size="lg"
            variant="onPhoto"
            icon="whatsapp"
            iconPosition="start"
            href={whatsappLink(`Olá! Quero saber mais sobre a ${brand.fullName}.`)}
            external
          >
            Entrar em contato
          </Button>
        </div>

        <div className={styles.info}>
          <div className={styles.block}>
            <p className={styles.label}>
              <Icon name="pin" size={18} /> {brand.addressLabel}
            </p>
            <p>{brand.address}</p>
            <p className={styles.demo}>Localização fictícia. O mapa e o endereço entram na versão da academia.</p>
          </div>
          <div className={styles.block}>
            <p className={styles.label}>
              <Icon name="clock" size={18} /> Funcionamento
            </p>
            <dl className={styles.hours}>
              {brand.hours.map((h) => (
                <div key={h.days}>
                  <dt>{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.demo}>Horários ilustrativos.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
