import styles from "./ProductModal.module.css"

export function ProductModal({
  category = "Nail art",
  description = "Cor, detalhes e personalidade em cada unha.",
  image,
  isAdmin = false,
  name = "Nail Art",
  price = 80,
  href = "#",
}) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price)

  return (
    <a className={styles.card} href={href} aria-label={`${name}: ver detalhes`}>
      <div className={styles.imageWrapper}>
        {image ? (
          <img className={styles.image} src={image} alt="" />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        )}
        <span className={styles.category}>{category}</span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </div>

      <div className={styles.content}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          <strong className={styles.price}>{formattedPrice}</strong>
          <span className={styles.action}>
            {isAdmin ? "Editar serviço" : "Ver detalhes"}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </a>
  )
}
