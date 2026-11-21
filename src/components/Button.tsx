import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { forwardRef, type ReactNode, type MouseEvent, type PointerEvent } from 'react'
import { Icon, type IconName } from './Icon'
import styles from './ui.module.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'onPhoto'

interface CommonProps {
  children: ReactNode
  variant?: Variant
  size?: 'md' | 'lg' | 'sm'
  icon?: IconName
  iconPosition?: 'start' | 'end'
  /** CTA magnético sutil — só em ponteiro fino e sem movimento reduzido */
  magnetic?: boolean
  className?: string
  block?: boolean
}

type ButtonProps = CommonProps & {
  href?: undefined
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit'
  disabled?: boolean
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-controls'?: string
}

type LinkProps = CommonProps & {
  href: string
  external?: boolean
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

export const Button = forwardRef<HTMLElement, ButtonProps | LinkProps>(function Button(props, ref) {
  const { children, variant = 'primary', size = 'md', icon, iconPosition = 'end', magnetic, className, block } = props
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })
  const isMagnetic = magnetic && !reduce

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!isMagnetic || !finePointer()) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    y.set(((e.clientY - r.top) / r.height - 0.5) * 8)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const cls = [styles.btn, styles[`btn_${variant}`], styles[`btn_${size}`], block && styles.btnBlock, className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon && iconPosition === 'start' && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {icon && iconPosition === 'end' && <Icon name={icon} size={18} className={styles.btnIcon} />}
    </>
  )

  const motionProps = {
    style: isMagnetic ? { x: sx, y: sy } : undefined,
    whileTap: reduce ? undefined : { scale: 0.97 },
    transition: { duration: 0.15 },
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    className: cls,
  }

  if ('href' in props && props.href) {
    const { href, external, onClick } = props
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...motionProps}
      >
        {content}
        {external && <span className="sr-only"> (abre em nova aba)</span>}
      </motion.a>
    )
  }

  const p = props as ButtonProps
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={p.type ?? 'button'}
      onClick={p.onClick}
      disabled={p.disabled}
      aria-describedby={p['aria-describedby']}
      aria-expanded={p['aria-expanded']}
      aria-controls={p['aria-controls']}
      {...motionProps}
    >
      {content}
    </motion.button>
  )
})
