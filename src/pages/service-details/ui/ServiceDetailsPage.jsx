import { ButtonAction } from "../../../shared/ui/buttonAction/button"
import { ButtonBack } from "../../../shared/ui/buttonBack/button"
import styles from "./ServiceDetailsPage.module.css"

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="4.5"
        width="14"
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 3v3M13.5 3v3M3 8h14M6.5 11h.01M10 11h.01M13.5 11h.01M6.5 14h.01M10 14h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ServiceDetailsPage({ service }) {
  if (!service) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Serviço não encontrado</h1>
          <p>Confira o endereço ou volte para a lista de serviços.</p>
          <ButtonBack href="/servicos">Voltar aos serviços</ButtonBack>
        </div>
      </main>
    )
  }

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(service.price)

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <ButtonBack className={styles.backLink} href="/servicos">
          Voltar aos serviços
        </ButtonBack>

        <article className={styles.service}>
          <img
            className={styles.image}
            src={service.image}
            alt={service.imageAlt}
          />

          <div className={styles.details}>
            <p className={styles.category}>{service.category}</p>
            <h1 className={styles.name}>{service.name}</h1>
            <p className={styles.price}>{formattedPrice}</p>
            <p className={styles.description}>{service.description}</p>

            <div className={styles.booking}>
              <p className={styles.bookingDescription}>
                Escolha uma data e veja os horários disponíveis para o seu
                atendimento.
              </p>
              <ButtonAction
                className={styles.bookingButton}
                icon={<CalendarIcon />}
              >
                Agendar este serviço
              </ButtonAction>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
