import { useEffect } from "react"
import { clearSessionUser } from "../../shared/auth/session"
import styles from "./MobileSidebar.module.css"

export function MobileSidebar({
  accountHref,
  accountLabel = "Minha conta",
  isAdmin,
  isOpen,
  onClose,
}) {
  const handleLogout = () => {
    clearSessionUser()
    onClose()
    window.location.assign("/entrar")
  }

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
              <a href="/admin/dashboard" onClick={onClose}>Dashboard</a>
              <a href="/admin/servicos" onClick={onClose}>Catálogo</a>
              <a href="/admin/agenda" onClick={onClose}>Minha agenda</a>
              <a href="/admin/meus-servicos" onClick={onClose}>Meus serviços</a>
            </>
          ) : (
            <>
              <a href="/" onClick={onClose}>Início</a>
              <a href="/servicos" onClick={onClose}>Serviços e inspirações</a>
            </>
          )}
          <a href={accountHref} onClick={onClose}>{accountLabel}</a>
          <button className={styles.logoutButton} type="button" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </aside>
    </>
  )
}
