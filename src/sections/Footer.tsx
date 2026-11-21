import type { MouseEvent } from 'react'
import { Logo } from '../components/Logo'
import { useApp } from '../context/AppContext'
import { brand, navItems } from '../data/brand'
import { modalities } from '../data/modalities'
import { scrollToId } from '../lib/motion'
import styles from './Footer.module.css'

export function Footer() {
  const { showSchedule, notify } = useApp()
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo />
          <p>Musculação, funcional, cardio e aulas coletivas em um só lugar.</p>
        </div>

        <nav aria-label="Rodapé" className={styles.col}>
          <h2>Navegação</h2>
          <ul>
            {navItems.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={go(n.id)}>
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#simulador" onClick={go('simulador')}>
                Simulador de plano
              </a>
            </li>
            <li>
              <a href="#faq" onClick={go('faq')}>
                Perguntas frequentes
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles.col}>
          <h2>Modalidades</h2>
          <ul>
            {modalities.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => showSchedule(m.id)}>
                  {m.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h2>Redes sociais</h2>
          <ul>
            {brand.social.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => notify(`O perfil do ${s.label} entra quando a academia informar o endereço. Links demonstrativos.`)}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.notice}>
          Protótipo demonstrativo. Marca, preços, horários, aulas e depoimentos são fictícios. Fotos licenciadas via Unsplash.
        </p>
        <div className={styles.signature}>
          {/* Espaço reservado para a marca d'água oficial Or7.dev */}
          <div className={styles.watermark} data-or7-watermark aria-hidden="true" />
          <p>{brand.credits.signature}</p>
        </div>
      </div>
    </footer>
  )
}
