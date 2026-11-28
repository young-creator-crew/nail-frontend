import styles from "./MarketingFooter.module.css"

const defaultNavigationGroups = [
  {
    title: "Explore",
    links: [
      { label: "Serviços", href: "/servicos" },
      { label: "Inspirações", href: "/#inspiration" },
    ],
  },
  {
    title: "Sua conta",
    links: [
      { label: "Entrar", href: "/entrar" },
      { label: "Cadastre-se", href: "/cadastro" },
    ],
  },
]

export function MarketingFooter({
  brandHref = "/",
  tagline = "Cuidado que se vê. Beleza que se sente.",
  navigationGroups = defaultNavigationGroups,
  legalLabel = "Nicole Nails | Agendamentos",
  notice,
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <a className={styles.footerLogo} href={brandHref}>nicole nails.</a>
            <p>{tagline}</p>
          </div>
          <nav className={styles.footerNavigation} aria-label="Links do rodapé">
            {navigationGroups.map(({ links, title }) => (
              <div key={title}>
                <h2>{title}</h2>
                {links.map(({ href, label }) => (
                  <a href={href} key={href}>{label}</a>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </div>
      <div className={styles.footerLegal}>
        <div className={styles.footerLegalContent}>
          <span>{legalLabel}</span>
          {notice && <span>{notice}</span>}
        </div>
      </div>
    </footer>
  )
}
