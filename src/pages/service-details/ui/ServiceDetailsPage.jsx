import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { ButtonBack } from "../../../shared/ui/button-back/ButtonBack"
import { CalendarIcon } from "../../../shared/ui/icons/Icons"
import styles from "./ServiceDetailsPage.module.css"

export function ServiceDetailsPage({ service, isAdmin = false }) {
  if (!service) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Serviço não encontrado</h1>
          <p>Confira o endereço ou volte para a lista de serviços.</p>
          <ButtonBack href={isAdmin ? "/admin/servicos" : "/servicos"}>
            Voltar aos serviços
          </ButtonBack>
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
        <ButtonBack
          className={styles.backLink}
          href={isAdmin ? "/admin/servicos" : "/servicos"}
        >
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
                {isAdmin
                  ? "Atualize os dados deste serviço no painel administrativo."
                  : "Escolha uma data e veja os horários disponíveis para o seu atendimento."}
              </p>
              <ButtonAction
                className={styles.bookingButton}
                href={isAdmin
                  ? `/admin/meus-servicos/editar?id=${service.id}`
                  : undefined}
                icon={isAdmin ? "✎" : <CalendarIcon />}
              >
                {isAdmin ? "Editar serviço" : "Agendar este serviço"}
              </ButtonAction>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
