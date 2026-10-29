import { useEffect, useState } from "react"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { ServiceCard } from "../../../entities/service/ui/ServiceCard"
import { getAdminServices } from "../../../entities/service/api/serviceApi"
import { getServiceImage } from "../../../entities/service/model/mock-service-images"
import styles from "./MyServices.module.css"

export function MyServices() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let isMounted = true

    getAdminServices()
      .then((response) => {
        if (!Array.isArray(response)) {
          throw new Error("A API retornou uma lista de serviços inválida.")
        }
        if (isMounted) {
          setServices(response)
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
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>SEU PORTFÓLIO, DO SEU JEITO</p>
        <h1 className={styles.title}>Meus serviços</h1>

        <ButtonAction
          className={styles.createButton}
          icon="+"
          iconPosition="left"
          onClick={() => window.location.assign("/admin/meus-servicos/adicionar")}
        >
          Novo serviço
        </ButtonAction>

        {isLoading && (
          <p className={styles.message} role="status">Carregando serviços...</p>
        )}

        {!isLoading && errorMessage && (
          <p className={styles.error} role="alert">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && services.length === 0 && (
          <p className={styles.message}>Nenhum serviço cadastrado.</p>
        )}

        {!isLoading && !errorMessage && services.length > 0 && (
          <section className={styles.services} aria-label="Serviços cadastrados">
            {services.map((service) => (
              <ServiceCard
                description={service.serviceDescription}
                href={`/admin/meus-servicos/editar?id=${service.idNailService}`}
                image={getServiceImage(service)}
                isAdmin
                key={service.idNailService}
                name={service.serviceName}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
