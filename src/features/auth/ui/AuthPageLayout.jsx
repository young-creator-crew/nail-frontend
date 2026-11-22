import { ButtonBack } from "../../../shared/ui/button-back/ButtonBack"
import { MarketingFooter } from "../../../widgets/marketing-footer/MarketingFooter"
import { MarketingHeader } from "../../../widgets/marketing-header/MarketingHeader"
import styles from "./AuthPageLayout.module.css"

const navigationLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/#services" },
  { label: "Inspirações", href: "/#inspiration" },
  { label: "Como funciona", href: "/#how-it-works" },
  { label: "Dúvidas", href: "/#faq" },
]

export function AuthPageLayout({
  children,
  formLabel,
  imageAlt,
  imageSrc,
  visualEyebrow,
  visualTitle,
  headerActionHref = "/cadastro",
  headerActionLabel = "Criar conta",
}) {
  return (
    <div className={styles.page}>
      <MarketingHeader
        actionHref={headerActionHref}
        actionLabel={headerActionLabel}
        navigationLinks={navigationLinks}
      />
      <main className={styles.main}>
        <section className={styles.visual} aria-label={imageAlt}>
          <img
            className={styles.visualImage}
            src={imageSrc}
            alt={imageAlt}
            fetchPriority="high"
          />
          <div className={styles.visualCopy}>
            <p className={styles.visualEyebrow}>{visualEyebrow}</p>
            <h2 className={styles.visualTitle}>{visualTitle}</h2>
            <p className={styles.visualFootnote}>
              NAIL ART / CUIDADO / PERSONALIDADE
            </p>
          </div>
        </section>

        <section className={styles.formPanel} aria-label={formLabel}>
          <ButtonBack className={styles.backLink} href="/">
            Voltar ao site
          </ButtonBack>
          <div className={styles.formContent}>{children}</div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
