import styles from "./ServiceCatalogFilter.module.css"
import { Input } from "../../../shared/ui/input/input"

export function ServiceCatalogFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className={styles.filters}>
      <div
        className={styles.categories}
        role="group"
        aria-label="Filtrar serviços por categoria"
      >
        {categories.map((category) => (
          <button
            className={`${styles.categoryButton} ${
              selectedCategory === category ? styles.selected : ""
            }`}
            type="button"
            aria-pressed={selectedCategory === category}
            key={category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.search}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4 4" />
        </svg>
        <Input
          label="Buscar um serviço"
          labelClassName={styles.visuallyHidden}
          wrapperClassName={styles.searchField}
          className={styles.searchControl}
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar um serviço"
        />
      </div>
    </div>
  )
}
