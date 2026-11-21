import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { FadeIn, MaskText, Photo } from '../components/Reveal'
import { communityPillars } from '../data/content'
import styles from './Community.module.css'

export function Community() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // deslocamentos opostos e pequenos dão profundidade à colagem
  const up = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40])
  const down = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 30])

  return (
    <section ref={ref} id="comunidade" className={`section ${styles.section}`} aria-labelledby="com-title">
      <div className="container">
        <div className={styles.top}>
          <MaskText id="com-title" className={`display ${styles.title}`} lines={['Treinar junto', 'muda o ritmo.']} />
          <p className="lead">
            A rotina aqui é feita de gente: instrutor que lembra do seu treino, turma que espera você na aula de quinta e um salão onde ninguém treina sozinho.
          </p>
        </div>

        <div className={styles.collage}>
          <motion.div className={styles.big} style={{ y: down }}>
            <Photo src={`${import.meta.env.BASE_URL}images/com-grupo.jpg`} alt="Aluna em aula coletiva puxando elásticos acima da cabeça" />
          </motion.div>
          <motion.div className={styles.tall} style={{ y: up }}>
            <Photo src={`${import.meta.env.BASE_URL}images/com-treinador.jpg`} alt="Aluna treinando com luvas em um aparelho de polia" direction="left" />
          </motion.div>
          <motion.div className={styles.small} style={{ y: down }}>
            <Photo src={`${import.meta.env.BASE_URL}images/com-parceria.jpg`} alt="Aluna erguendo uma barra com anilhas, em preto e branco" />
          </motion.div>

          <FadeIn className={styles.quote}>
            <blockquote>
              <p>“Comecei indo duas vezes por semana. Hoje a turma das sete me cobra quando eu falto.”</p>
            </blockquote>
            <p className={styles.quoteMeta}>Depoimento ilustrativo, criado para esta demonstração</p>
          </FadeIn>
        </div>

        <ul className={styles.pillars}>
          {communityPillars.map((p, i) => (
            <li key={p.title} className={styles.pillar}>
              <FadeIn delay={i * 0.06}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
