import { useEffect, useState } from "react"
import { getServices } from "../../entities/service/api/serviceApi"
import { getServiceImage } from "../../entities/service/model/mock-service-images"
import { ButtonAction } from "../../shared/ui/button-action/ButtonAction"
import { ArrowUpRightIcon, CalendarIcon } from "../../shared/ui/icons/Icons"
import { ServiceCard } from "../../entities/service/ui/ServiceCard"
import styles from "./Home.module.css"

const benefits = [
  { icon: "✧", label: "Beleza nos detalhes" },
  { icon: "▦", label: "Agende com praticidade" },
  { icon: "✣", label: "Inspire-se em cada escolha" },
]

const heroImage =
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85"

export function Home() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

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
            <ButtonAction href="/servicos">Explorar serviços</ButtonAction>
            <p className={styles.bookingNote}>
              <CalendarIcon />
              Seu horário, sem complicação.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <img
              className={styles.heroImage}
              src={heroImage}
              alt="Unhas decoradas com acabamento em nail art"
            />
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
          <a className={styles.sectionLink} href="/servicos">
            Ver todos os serviços <ArrowUpRightIcon />
          </a>
        </div>
        {isLoading && (
          <p className={styles.status} role="status">Carregando serviços...</p>
        )}
        {!isLoading && errorMessage && (
          <p className={styles.statusError} role="alert">{errorMessage}</p>
        )}
        {!isLoading && !errorMessage && services.length === 0 && (
          <p className={styles.status} role="status">
            Nenhum serviço disponível no momento.
          </p>
        )}
        {!isLoading && !errorMessage && services.length > 0 && (
          <div className={styles.cardGrid}>
            {services.slice(0, 4).map((service) => (
              <ServiceCard
                key={service.idNailService}
                description={service.serviceDescription}
                href={`/servicos/${service.idNailService}`}
                image={getServiceImage(service)}
                imageAlt={service.serviceName}
                name={service.serviceName}
              />
            ))}
          </div>
        )}
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
          <a className={styles.sectionLink} href="/servicos">
            Encontre seu próximo horário <ArrowUpRightIcon />
          </a>
        </div>
      </section>
    </main>
  )
}
