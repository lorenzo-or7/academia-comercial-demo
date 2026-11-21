import { motion, useReducedMotion } from 'motion/react'
import { useState, type ElementType, type ReactNode } from 'react'
import { ease } from '../lib/motion'
import styles from './ui.module.css'

/**
 * Text Mask Reveal: cada linha sobe de dentro de uma máscara.
 * O texto completo fica acessível como uma única string.
 */
export function MaskText({
  lines,
  as: Tag = 'h2',
  className,
  delay = 0,
  immediate = false,
  id,
}: {
  lines: string[]
  as?: ElementType
  className?: string
  delay?: number
  /** anima na montagem, em vez de ao entrar na tela */
  immediate?: boolean
  id?: string
}) {
  const reduce = useReducedMotion()
  const trigger = immediate ? { animate: 'shown' } : { whileInView: 'shown', viewport: { once: true, amount: 0.4 } }
  return (
    <Tag className={className} id={id} aria-label={lines.join(' ')} data-focus-target={id ? '' : undefined}>
      <motion.span initial={reduce ? 'shown' : 'hidden'} {...trigger} className={styles.maskBlock} aria-hidden="true">
        {lines.map((line, i) => (
          <span key={i} className={styles.maskLine}>
            <motion.span
              className={styles.maskInner}
              variants={{
                hidden: { y: '105%' },
                shown: { y: '0%', transition: { duration: 0.85, ease: ease.out, delay: delay + i * 0.09 } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/** Image Reveal: a fotografia abre por uma máscara de baixo para cima. */
export function Photo({
  src,
  alt,
  className,
  reveal = true,
  priority = false,
  sizes,
  direction = 'up',
}: {
  src: string
  alt: string
  className?: string
  reveal?: boolean
  priority?: boolean
  sizes?: string
  direction?: 'up' | 'left'
}) {
  const reduce = useReducedMotion()
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const hiddenClip = direction === 'up' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)'
  const animateReveal = reveal && !reduce

  // O observador fica no elemento externo (sem clip-path): o Chrome considera
  // o clip-path do próprio alvo e nunca dispararia com a máscara fechada.
  return (
    <motion.div
      className={[styles.photo, className].filter(Boolean).join(' ')}
      data-state={state}
      initial={animateReveal ? 'hidden' : false}
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className={styles.photoMask}
        variants={{
          hidden: { clipPath: hiddenClip },
          shown: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.9, ease: ease.inOut } },
        }}
      >
        {state !== 'error' ? (
          <motion.img
            src={src}
            alt={alt}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setState('loaded')}
            onError={() => setState('error')}
            variants={{ hidden: { scale: 1.12 }, shown: { scale: 1, transition: { duration: 1.2, ease: ease.out } } }}
          />
        ) : (
          <PhotoFallback alt={alt} />
        )}
      </motion.div>
    </motion.div>
  )
}

/** Fallback elegante quando a foto não carrega: mantém o enquadramento. */
export function PhotoFallback({ alt }: { alt: string }) {
  return (
    <div className={styles.photoFallback} role="img" aria-label={alt}>
      <svg viewBox="0 0 120 40" aria-hidden="true">
        <path className="pulse-path" d="M2 22h30l7-14 10 26 9-20 5 8h55" />
      </svg>
      <span>Imagem indisponível</span>
    </div>
  )
}

/** Entrada simples para blocos de conteúdo. */
export function FadeIn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  )
}
