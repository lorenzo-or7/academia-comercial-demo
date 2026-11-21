import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Icon } from '../components/Icon'
import { MaskText, PhotoFallback } from '../components/Reveal'
import { facilities } from '../data/facilities'
import { useBodyLock, useFocusTrap } from '../hooks'
import { ease } from '../lib/motion'
import styles from './Facilities.module.css'

const total = facilities.length
const wrap = (i: number) => (i + total) % total

function SlideImage({ src, alt, eager }: { src: string; alt: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <PhotoFallback alt={alt} />
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} draggable={false} onError={() => setFailed(true)} />
}

export function Facilities() {
  const [[index, dir], setState] = useState<[number, number]>([0, 0])
  const [zoom, setZoom] = useState(false)
  const zoomBtnRef = useRef<HTMLButtonElement>(null)
  const closeZoom = useCallback(() => {
    setZoom(false)
    // devolve o foco ao botão que abriu o modal
    requestAnimationFrame(() => zoomBtnRef.current?.focus({ preventScroll: true }))
  }, [])
  const reduce = useReducedMotion()
  const current = facilities[index]

  const go = useCallback((next: number) => {
    setState(([i]) => [wrap(next), next >= i ? 1 : -1])
  }, [])
  const step = useCallback((d: 1 | -1) => setState(([i]) => [wrap(i + d), d]), [])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) step(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) step(-1)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
    }
  }

  // pré-carrega a próxima imagem
  useEffect(() => {
    const img = new Image()
    img.src = facilities[wrap(index + 1)].image
  }, [index])

  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { clipPath: d >= 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }),
    center: { clipPath: 'inset(0 0% 0 0%)', opacity: 1 },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0.4, x: d >= 0 ? '-8%' : '8%' }),
  }

  return (
    <section id="estrutura" className={`section ${styles.section}`} aria-labelledby="est-title">
      <div className="container">
        <header className="section-head">
          <MaskText id="est-title" className="display" lines={['Espaço para', 'cada treino.']} />
          <p className="lead">Cinco ambientes pensados para o treino fluir, da carga pesada à volta à calma.</p>
        </header>

        <div className={styles.gallery}>
          <div
            className={styles.stage}
            role="region"
            aria-roledescription="carrossel"
            aria-label="Ambientes da academia"
            tabIndex={0}
            onKeyDown={onKey}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={current.id}
                className={styles.slide}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: ease.inOut }}
                drag={reduce ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${total}: ${current.title}`}
              >
                <SlideImage src={current.image} alt={current.alt} eager={index === 0} />
              </motion.div>
            </AnimatePresence>

            <button ref={zoomBtnRef} type="button" className={styles.zoomBtn} onClick={() => setZoom(true)}>
              <Icon name="expand" size={18} />
              <span>Ampliar foto</span>
            </button>

            <div className={styles.controls}>
              <button type="button" className={styles.arrow} onClick={() => step(-1)} aria-label="Ambiente anterior">
                <Icon name="arrowLeft" />
              </button>
              <button type="button" className={styles.arrow} onClick={() => step(1)} aria-label="Próximo ambiente">
                <Icon name="arrowRight" />
              </button>
            </div>
          </div>

          <div className={styles.side}>
            <div className={styles.caption} aria-live="polite">
              <p className={styles.counter}>
                <span>{String(index + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: ease.out }}
                >
                  <h3 className="h3">{current.title}</h3>
                  <p className={styles.captionText}>{current.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <ul className={styles.list} aria-label="Escolher ambiente">
              {facilities.map((f, i) => (
                <li key={f.id}>
                  <button
                    type="button"
                    className={styles.item}
                    aria-current={i === index ? 'true' : undefined}
                    onClick={() => go(i)}
                  >
                    <span className={styles.itemThumb} aria-hidden="true">
                      <img src={f.image} alt="" loading="lazy" />
                    </span>
                    <span>{f.title}</span>
                    {i === index && (
                      <motion.span layoutId="facility-bar" className={styles.itemBar} transition={{ duration: 0.35, ease: ease.out }} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <p className="demo-tag">Fotos de banco de imagens licenciadas, ilustrando os ambientes</p>
          </div>
        </div>
      </div>

      <AnimatePresence>{zoom && <Lightbox index={index} onClose={closeZoom} onStep={step} />}</AnimatePresence>
    </section>
  )
}

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const f = facilities[index]
  useBodyLock(true)
  useFocusTrap(ref, true, onClose)

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onStep])

  return (
    <motion.div
      ref={ref}
      className={`${styles.lightbox} on-dark`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.lbTop}>
        <p id="lightbox-title">
          <strong>{f.title}</strong>
          <span>
            {index + 1} de {total}
          </span>
        </p>
        <button type="button" className={styles.lbClose} onClick={onClose} aria-label="Fechar foto ampliada" data-autofocus>
          <Icon name="close" />
        </button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.figure
          key={f.id}
          className={styles.lbFigure}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: ease.out }}
        >
          <SlideImage src={f.image} alt={f.alt} eager />
          <figcaption>{f.description}</figcaption>
        </motion.figure>
      </AnimatePresence>
      <div className={styles.lbNav}>
        <button type="button" className={styles.arrow} onClick={() => onStep(-1)} aria-label="Foto anterior">
          <Icon name="arrowLeft" />
        </button>
        <button type="button" className={styles.arrow} onClick={() => onStep(1)} aria-label="Próxima foto">
          <Icon name="arrowRight" />
        </button>
      </div>
    </motion.div>
  )
}
