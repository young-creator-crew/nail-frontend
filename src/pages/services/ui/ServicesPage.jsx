import { useMemo, useState } from "react"
import { services, serviceCategories } from "../../../entities/service/model/services"
import { ServiceCatalogFilter } from "../../../features/service-catalog-filter/ui/ServiceCatalogFilter"
import { ServiceCard } from "../../../entities/service/ui/ServiceCard"
import styles from "./ServicesPage.module.css"

export function ServicesPage({ isAdmin = false }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredServices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR")

    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === "Todos" || service.category === selectedCategory
      const matchesSearch =
        !normalizedSearch ||
        `${service.name} ${service.category} ${service.description}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [searchTerm, selectedCategory])

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
          categories={serviceCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {filteredServices.length > 0 ? (
          <section className={styles.grid} aria-label="Catálogo de serviços">
            {filteredServices.map((service) => (
              <ServiceCard
                category={service.category}
                description={service.description}
                href={`${isAdmin ? "/admin" : ""}/servicos/${service.id}`}
                image={service.image}
                imageAlt={service.imageAlt}
                key={service.id}
                name={service.name}
                price={service.price}
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
