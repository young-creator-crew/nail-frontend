import { ButtonAction } from "../../shared/ui/buttonAction/button"
import { ProductModal } from "../../shared/ui/productModal/ProductModal"
import styles from "./Home.module.css"

const benefits = [
  { icon: "✧", label: "Beleza nos detalhes" },
  { icon: "▦", label: "Agende com praticidade" },
  { icon: "✣", label: "Inspire-se em cada escolha" },
]

const services = [
  {
    title: "[TÍTULO_01]",
    category: "[CATEGORIA_01]",
    description: "[DESCRIÇÃO_01]",
    price: "[VALOR_01]",
    href: "[LINK_OFICIAL_01]",
  },
  {
    title: "[TÍTULO_02]",
    category: "[CATEGORIA_02]",
    description: "[DESCRIÇÃO_02]",
    price: "[VALOR_02]",
    href: "[LINK_OFICIAL_02]",
  },
  {
    title: "[TÍTULO_03]",
    category: "[CATEGORIA_03]",
    description: "[DESCRIÇÃO_03]",
    price: "[VALOR_03]",
    href: "[LINK_OFICIAL_03]",
  },
  {
    title: "[TÍTULO_04]",
    category: "[CATEGORIA_04]",
    description: "[DESCRIÇÃO_04]",
    price: "[VALOR_04]",
    href: "[LINK_OFICIAL_04]",
  },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M4 14 14 4M6 4h8v8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <rect x="3" y="4.5" width="12" height="10.5" rx="1" fill="none" stroke="currentColor" />
      <path d="M5.5 3v3M12.5 3v3M3 7.5h12" fill="none" stroke="currentColor" />
    </svg>
  )
}

export function Home() {
  return (
    <main>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" />
              SEU PRÓXIMO MOMENTO DE CUIDADO
            </p>
            <h1 id="hero-title">
              Pequenos detalhes.
              <br />
              Uma beleza
              <br />
              <em>inteiramente sua.</em>
            </h1>
            <p className={styles.heroDescription}>
              Inspire-se, escolha seu serviço e encontre um horário para você.
            </p>
            <ButtonAction href="[LINK_OFICIAL_DA_SECAO]">Explorar serviços</ButtonAction>
            <p className={styles.bookingNote}>
              <CalendarIcon />
              Seu horário, sem complicação.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div
              className={styles.heroImagePlaceholder}
              role="img"
              aria-label="Imagem principal aguardando asset oficial"
            >
              <span>IMAGEM PRINCIPAL</span>
              <small>Asset oficial em breve</small>
            </div>
            <span className={styles.visualCaption}>FEITO PARA VOCÊ</span>
            <span className={styles.visualCount}>01 / 04</span>
            <span className={styles.visualVertical}>ARTE, CUIDADO &amp; PERSONALIDADE</span>
            <div className={styles.visualBadge}>
              <span aria-hidden="true">✣</span>
              <span>
                Mais que unhas.
                <strong>Um jeito de se expressar.</strong>
              </span>
            </div>
            <span className={styles.visualBurst} aria-hidden="true">✱</span>
          </div>
        </div>
      </section>

      <section className={styles.benefits} aria-label="Benefícios">
        <div className={styles.benefitList}>
          {benefits.map((benefit) => (
            <div className={styles.benefit} key={benefit.label}>
              <span className={styles.benefitIcon} aria-hidden="true">{benefit.icon}</span>
              <span>{benefit.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.services} aria-labelledby="services-title">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>ENCONTRE O SEU ESTILO</p>
            <h2 id="services-title">Serviços e inspirações</h2>
          </div>
          <a className={styles.sectionLink} href="[LINK_OFICIAL_DA_SECAO]">
            Ver todos os serviços <ArrowIcon />
          </a>
        </div>
        <div className={styles.cardGrid}>
          {services.map((service) => (
            <ProductModal
              key={service.title}
              category={service.category}
              description={service.description}
              href={service.href}
              name={service.title}
              price={service.price}
            />
          ))}
        </div>
      </section>

      <section className={styles.about} aria-labelledby="about-title">
        <div>
          <p className={styles.eyebrow}>UM ESPAÇO PARA VOCÊ</p>
          <h2 id="about-title">
            Seu cuidado começa
            <br />
            com uma escolha.
          </h2>
        </div>
        <div className={styles.aboutCopy}>
          <p>
            Um espaço para conhecer os serviços, ver trabalhos realizados e
            agendar com mais praticidade.
          </p>
          <a className={styles.sectionLink} href="[LINK_OFICIAL_DA_SECAO]">
            Encontre seu próximo horário <ArrowIcon />
          </a>
        </div>
      </section>
    </main>
  )
}
