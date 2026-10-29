import { useEffect, useState } from "react"
import { getServiceById } from "../../../entities/service/api/serviceApi"
import { getServiceImage } from "../../../entities/service/model/mock-service-images"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { ButtonBack } from "../../../shared/ui/button-back/ButtonBack"
import { CalendarIcon } from "../../../shared/ui/icons/Icons"
import styles from "./ServiceDetailsPage.module.css"

export function ServiceDetailsPage({ serviceId, isAdmin = false }) {
  const [service, setService] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    getServiceById(serviceId)
      .then(setService)
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Não foi possível carregar o serviço."))
      .finally(() => setIsLoading(false))
  }, [serviceId])

  if (isLoading) {
    return <main className={styles.page}><div className={styles.notFound}>Carregando serviço...</div></main>
  }

  if (errorMessage || !service) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Serviço não encontrado</h1>
          <p>{errorMessage || "Confira o endereço ou volte para a lista de serviços."}</p>
          <ButtonBack href={isAdmin ? "/admin/servicos" : "/servicos"}>
            Voltar aos serviços
          </ButtonBack>
        </div>
      </main>
    )
  }

  const options = service.options ?? []
  const lowestPrice = options.length ? Math.min(...options.map((option) => option.price)) : null
  const formattedPrice = lowestPrice === null ? "Consulte as opções" : new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(lowestPrice)

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
            src={getServiceImage(service)}
            alt={service.serviceName}
          />

          <div className={styles.details}>
            <p className={styles.category}>{service.active ? "Serviço disponível" : "Serviço inativo"}</p>
            <h1 className={styles.name}>{service.serviceName}</h1>
            <p className={styles.price}>{formattedPrice}</p>
            <p className={styles.description}>{service.serviceDescription}</p>
            <div>
              {options.map((option) => (
                <p key={option.idNailServiceOption}>
                  {option.optionType} · {option.durationMinutes} min · {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(option.price)}
                </p>
              ))}
            </div>

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
