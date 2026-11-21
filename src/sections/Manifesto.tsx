import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { MaskText } from '../components/Reveal'
import styles from './Manifesto.module.css'

const statement =
  'Aqui cada treino tem um porquê. Você chega, encontra um plano feito para o seu momento, alguém para ajustar a execução e gente que treina no mesmo horário que você. O resultado vem da soma: método, constância e companhia.'

const principles = [
  { term: 'Método', text: 'Treino montado e revisado por instrutores, não copiado da internet.' },
  { term: 'Constância', text: 'Horários amplos e aulas fixas para o treino caber na sua semana.' },
  { term: 'Companhia', text: 'Turmas e salão cheios de gente com o mesmo objetivo que o seu.' },
]

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <motion.span style={{ opacity }} className={styles.word}>
      {children}{' '}
    </motion.span>
  )
}

export function Manifesto() {
  const textRef = useRef<HTMLParagraphElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress: textProgress } = useScroll({ target: textRef, offset: ['start 85%', 'end 50%'] })
  const { scrollYProgress: mediaProgress } = useScroll({ target: mediaRef, offset: ['start end', 'center center'] })
  const clip = useTransform(mediaProgress, [0, 1], ['inset(14% 18% 14% 18% round 28px)', 'inset(0% 0% 0% 0% round 4px)'])
  const imgScale = useTransform(mediaProgress, [0, 1], [1.3, 1.02])

  const words = statement.split(' ')

  return (
    <section id="manifesto" className={`section ${styles.manifesto}`} aria-labelledby="manifesto-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <MaskText id="manifesto-title" className={`display ${styles.title}`} lines={['Não é só treino.', 'É evolução.']} />

          <p ref={textRef} className={styles.statement}>
            {reduce
              ? statement
              : words.map((w, i) => (
                  <Word key={i} progress={textProgress} range={[i / words.length, (i + 1) / words.length]}>
                    {w}
                  </Word>
                ))}
          </p>

          <dl className={styles.principles}>
            {principles.map((p) => (
              <div key={p.term} className={styles.principle}>
                <dt>{p.term}</dt>
                <dd>{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div ref={mediaRef} className={styles.mediaCol}>
          <motion.figure className={styles.media} style={reduce ? undefined : { clipPath: clip }}>
            <motion.img
              src={`${import.meta.env.BASE_URL}images/manifesto.jpg`}
              alt="Atleta de costas segurando uma barra acima da cabeça em um rack de treino"
              loading="lazy"
              style={reduce ? undefined : { scale: imgScale }}
            />
          </motion.figure>
        </div>
      </div>
    </section>
  )
}
