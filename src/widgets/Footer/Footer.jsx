import styles from "./Footer.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <a className={styles.brand} href="/" aria-label="Nail Design - página inicial">
          <span className={styles.brandName}>Nail Design</span>
          <span className={styles.brandSubtitle}>AGENDAMENTOS</span>
        </a>

        <p className={styles.tagline}>Cuidado que se vê. Beleza que se sente.</p>

        <p className={styles.notice}>Protótipo interativo · Dados demonstrativos</p>
      </div>
    </footer>
  )
}
