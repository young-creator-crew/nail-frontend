import { ButtonAction } from "../../shared/ui/buttonAction/button"
import { ProductModal } from "../../shared/ui/productModal/ProductModal"
import styles from "./MyServices.module.css"

const services = [
  {
    id: "nail-art",
    category: "Nail art",
    description: "Cor, detalhes e personalidade em cada unha.",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=85",
    name: "Nail Art",
    price: 80,
  },
  {
    id: "manicure-classica",
    category: "Clássico",
    description: "O cuidado essencial, com um acabamento impecável.",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=85",
    name: "Manicure Clássica",
    price: 45,
  },
  {
    id: "gel-alongamento",
    category: "Gel",
    description: "Comprimento e delicadeza do seu jeito.",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=85",
    name: "Gel Alongamento",
    price: 120,
  },
  {
    id: "nail-art-colorida",
    category: "Nail art",
    description: "Uma dose de criatividade para sair do comum.",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=85",
    name: "Nail Art Colorida",
    price: 90,
  },
]

export function MyServices() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>SEU PORTFÓLIO, DO SEU JEITO</p>
        <h1 className={styles.title}>Meus serviços</h1>

        <ButtonAction
          className={styles.createButton}
          icon="+"
          iconPosition="left"
          onClick={() => window.location.assign("/meus-servicos/novo")}
        >
          Novo serviço
        </ButtonAction>

        <section className={styles.services} aria-label="Serviços cadastrados">
          {services.map((service) => (
            <ProductModal
              category={service.category}
              description={service.description}
              href={`/meus-servicos/${service.id}`}
              image={service.image}
              imageAspectRatio={0.95}
              isAdmin
              key={service.id}
              name={service.name}
              price={service.price}
            />
          ))}
        </section>
      </div>
    </main>
  )
}
