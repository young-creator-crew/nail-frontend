import { useEffect, useMemo, useState } from "react"
import { getServices } from "../../entities/service/api/serviceApi"
import { ArrowUpRightIcon } from "../../shared/ui/icons/Icons"
import { ButtonAction } from "../../shared/ui/button-action/ButtonAction"
import { MarketingFooter } from "../../widgets/marketing-footer/MarketingFooter"
import { MarketingHeader } from "../../widgets/marketing-header/MarketingHeader"
import styles from "./Home.module.css"

const heroImage =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85"

const introImage = "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85"

const faqItems = [
  {
    question: "Como escolho o serviço certo?",
    answer: "Explore as fotos, compare as descrições e os detalhes de cada serviço para encontrar o que combina com você.",
  },
  {
    question: "Posso ver os valores antes de entrar?",
    answer: "Sim. Os serviços e valores disponíveis aparecem no catálogo. Alguns serviços podem ter opções e preços diferentes.",
  },
  {
    question: "Preciso de uma conta para continuar?",
    answer: "Você pode conhecer o catálogo sem entrar. O agendamento ainda não está disponível.",
  },
]

function getStartingPrice(service) {
  const prices = (Array.isArray(service?.options) ? service.options : [])
    .map((option) => Number(option?.price))
    .filter((price) => Number.isFinite(price) && price >= 0)

  if (prices.length === 0) {
    return "Consulte detalhes"
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Math.min(...prices))
}

function FlowerDecoration({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        {Array.from({ length: 8 }, (_, index) => (
          <ellipse
            cx="50"
            cy="23"
            key={index}
            rx="9"
            ry="22"
            transform={`rotate(${index * 45} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="8" />
      </g>
    </svg>
  )
}

function HomeServiceCard({ service }) {
  const image = service.photoUrl

  return (
    <a
      className={styles.serviceCard}
      href={`/servicos/${service.idNailService}`}
      aria-label={`${service.serviceName || "Serviço de beleza"}: ver detalhes`}
    >
      <div className={styles.serviceImageWrap}>
        {image ? (
          <img
            className={styles.serviceImage}
            src={image}
            alt={service.serviceName || "Inspiração de unhas"}
            loading="lazy"
          />
        ) : (
          <div className={styles.serviceImagePlaceholder} aria-hidden="true" />
        )}
      </div>
      <div className={styles.serviceCardContent}>
        <h3>{service.serviceName || "Serviço de beleza"}</h3>
        <p>{service.serviceDescription || "Conheça os detalhes deste serviço."}</p>
        <strong>{getStartingPrice(service)}</strong>
        <span className={styles.serviceDetails}>
          Ver detalhes <ArrowUpRightIcon />
        </span>
      </div>
    </a>
  )
}

export function Home() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const targetId = window.location.hash.slice(1)
    if (!targetId) return

    document.getElementById(targetId)?.scrollIntoView()
  }, [])

  useEffect(() => {
    let isMounted = true

    getServices()
      .then((response) => {
        if (!Array.isArray(response)) {
          throw new Error("A API retornou uma lista de serviços inválida.")
        }

        if (isMounted) {
          setServices(response.filter((service) => service.active !== false))
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os serviços.",
          )
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const galleryImages = useMemo(() => {
    const servicesWithImages = services
      .map((service) => ({
        src: service.photoUrl,
        alt: service.serviceName || "Inspiração de unhas",
      }))
      .filter((image) => image.src)

    return servicesWithImages.slice(0, 3)
  }, [services])

  return (
    <div className={styles.page}>
      <MarketingHeader />

      <main>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>NAIL ART &amp; AUTOEXPRESSÃO</p>
            <h1 id="home-title" className={styles.heroTitle}>
              Pequenos
              <br />
              detalhes.
              <em>Uma beleza</em>
              <span>inteiramente sua.</span>
            </h1>
            <p className={styles.heroDescription}>
              Inspire-se, escolha seu serviço e encontre um horário para você.
            </p>
            <div className={styles.heroActions}>
              <ButtonAction className={styles.heroButton} href="/servicos">
                Explorar serviços
              </ButtonAction>
              <a className={styles.textLink} href="#inspiration">
                Conheça nosso universo <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className={styles.heroStatement}>
              Cuidado que se vê. Beleza que se sente.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroImageFrame}>
              <img
                src={heroImage}
                alt="Retrato de uma mulher em um momento de cuidado e beleza"
                fetchPriority="high"
              />
            </div>
            <a className={styles.heroBadge} href="/agendamento">
              <ArrowUpRightIcon />
              <span>Seu próximo<br />momento</span>
            </a>
            <p className={styles.heroCaption}>A beleza de ser você</p>
          </div>
        </section>

        <section className={styles.intro} aria-labelledby="intro-title">
          <div className={styles.introContent}>
            <img
              className={styles.introImage}
              src={introImage}
              alt="Mãos com manicure em tons suaves"
              loading="lazy"
            />
            <div className={styles.introCopy}>
              <p className={styles.eyebrow}>MAIS QUE UNHAS</p>
              <h2 id="intro-title">Um jeito de <em>se expressar.</em></h2>
              <p>
                Um espaço para conhecer os serviços, ver trabalhos realizados
                e agendar com mais praticidade.
              </p>
            </div>
            <div className={styles.introList}>
              <p className={styles.eyebrow}>Beleza com intenção, personalidade em cada escolha.</p>
              <ul>
                <li><strong>Nail Art</strong><span>Cor e personalidade</span></li>
                <li><strong>Manicure</strong><span>Cuidado essencial</span></li>
                <li><strong>Alongamento</strong><span>Comprimento e delicadeza</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section id="services" className={styles.services} aria-labelledby="services-title">
          <FlowerDecoration className={styles.serviceFlower} />
          <div className={styles.servicesPanel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 id="services-title">Seu estilo.<br /><em>sua próxima escolha.</em></h2>
              </div>
              <div className={styles.servicesIntro}>
                <p>Da delicadeza do clássico à liberdade de criar. Escolha um serviço e descubra os detalhes.</p>
                <ButtonAction className={styles.servicesButton} href="/servicos">
                  Ver todos os serviços
                </ButtonAction>
              </div>
            </div>

            {isLoading && <p className={styles.status} role="status">Carregando serviços...</p>}
            {!isLoading && errorMessage && (
              <p className={styles.statusError} role="alert">
                Não foi possível carregar os serviços: {errorMessage}
              </p>
            )}
            {!isLoading && !errorMessage && services.length === 0 && (
              <p className={styles.status} role="status">Nenhum serviço disponível no momento.</p>
            )}
            {!isLoading && !errorMessage && services.length > 0 && (
              <div className={styles.serviceGrid}>
                {services.slice(0, 4).map((service) => (
                  <HomeServiceCard
                    key={service.idNailService}
                    service={service}
                  />
                ))}
              </div>
            )}
            <p className={styles.panelNote}>
              Os valores seguem as opções cadastradas.
            </p>
          </div>
        </section>

        <section id="inspiration" className={styles.inspiration} aria-labelledby="inspiration-title">
          <div className={styles.inspirationHeading}>
            <div>
              <h2 id="inspiration-title">Salve na sua <em>inspiração.</em></h2>
            </div>
            <div className={styles.inspirationCta}>
              <p>Texturas, cores e possibilidades. Uma seleção para descobrir o que é a sua cara.</p>
              <ButtonAction className={styles.inspirationButton} href="/servicos">
                Encontre seu estilo
              </ButtonAction>
            </div>
          </div>
          {isLoading && <p className={styles.status} role="status">Carregando inspirações...</p>}
          {!isLoading && errorMessage && <p className={styles.statusError} role="alert">Não foi possível carregar as inspirações.</p>}
          {!isLoading && !errorMessage && galleryImages.length === 0 && <p className={styles.status}>Nenhuma foto de serviço disponível no momento.</p>}
          <div className={styles.gallery}>
            {galleryImages.map((image, index) => (
              <figure
                className={`${styles.galleryItem} ${styles[`galleryItem${index + 1}`]}`}
                key={`${image.src}-${index}`}
              >
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption>{`0${index + 1} / ${image.alt}`}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorks} aria-label="Como funciona">
          <ol className={styles.steps}>
            <li>
              <span>01</span>
              <div><h3>Encontre sua inspiração</h3><p>Explore os trabalhos e descubra o que combina com você.</p></div>
            </li>
            <li>
              <span>02</span>
              <div><h3>Escolha seu serviço</h3><p>Veja as opções, os detalhes e os valores.</p></div>
            </li>
            <li>
              <span>03</span>
              <div><h3>Reserve um tempo para você</h3><p>O agendamento estará disponível após a integração com o backend.</p></div>
            </li>
          </ol>
        </section>

        <section id="faq" className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.faqIntro}>
            <h2 id="faq-title">Vamos tirar<br /><em>suas dúvidas?</em></h2>
            <p>Mais clareza para fazer a sua próxima escolha.</p>
          </div>
          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <details className={styles.faqItem} key={item.question} open={index === 0}>
                <summary>
                  {item.question}
                  <span aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  )
}
