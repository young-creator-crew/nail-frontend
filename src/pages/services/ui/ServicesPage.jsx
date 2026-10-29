import { useEffect, useMemo, useState } from "react"
import { getAdminServices, getServices } from "../../../entities/service/api/serviceApi"
import { getServiceImage } from "../../../entities/service/model/mock-service-images"
import { ServiceCatalogFilter } from "../../../features/service-catalog-filter/ui/ServiceCatalogFilter"
import { ServiceCard } from "../../../entities/service/ui/ServiceCard"
import styles from "./ServicesPage.module.css"

export function ServicesPage({ isAdmin = false }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const load = isAdmin ? getAdminServices : getServices
    load()
      .then((response) => setServices(Array.isArray(response) ? response : []))
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Não foi possível carregar os serviços."))
      .finally(() => setIsLoading(false))
  }, [isAdmin])

  const filteredServices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR")

    return services.filter((service) => {
      const name = service.serviceName ?? ""
      const description = service.serviceDescription ?? ""
      const matchesCategory =
        selectedCategory === "Todos"
      const matchesSearch =
        !normalizedSearch ||
        `${name} ${description}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [searchTerm, selectedCategory, services])

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Escolha seu próximo cuidado</p>
          <h1 className={styles.title}>Serviços e inspirações</h1>
          <p className={styles.description}>
            Um estilo para cada momento. Qual combina com o seu?
          </p>
        </header>

        <ServiceCatalogFilter
          categories={["Todos"]}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {isLoading ? <p role="status">Carregando serviços...</p> : errorMessage ? (
          <p role="alert">{errorMessage}</p>
        ) : filteredServices.length > 0 ? (
          <section className={styles.grid} aria-label="Catálogo de serviços">
            {filteredServices.map((service) => (
              <ServiceCard
                description={service.serviceDescription}
                href={`${isAdmin ? "/admin" : ""}/servicos/${service.idNailService}`}
                image={getServiceImage(service)}
                imageAlt={service.serviceName}
                key={service.idNailService}
                name={service.serviceName}
              />
            ))}
          </section>
        ) : (
          <p className={styles.emptyState} role="status">
            Nenhum serviço encontrado. Tente outra busca ou categoria.
          </p>
        )}
      </div>
    </main>
  )
}
