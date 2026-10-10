import { useEffect } from "react"
import styles from "./MobileSidebar.module.css"

export function MobileSidebar({ accountHref, isAdmin, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        aria-hidden={!isOpen}
        onClick={onClose}
      />

      <aside
        id="mobile-navigation"
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
        aria-label="Menu de navegação móvel"
        aria-hidden={!isOpen}
      >
        <div className={styles.header}>
          <span>Menu</span>
          <button
            className={styles.closeButton}
            type="button"
            aria-label="Fechar menu de navegação"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <nav className={styles.navigation} aria-label="Navegação móvel">
          {isAdmin ? (
            <>
              <a href="/admin/agenda" onClick={onClose}>Minha agenda</a>
              <a href="/admin/servicos" onClick={onClose}>Meus serviços</a>
            </>
          ) : (
            <>
              <a href="/servicos" onClick={onClose}>Serviços</a>
              <a href={accountHref} onClick={onClose}>Meu perfil</a>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
