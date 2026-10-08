import { useEffect, useState } from "react"
import logo from "../../shared/assets/Logo.svg"
import menuIcon from "../../shared/assets/Menu.svg"
import profileIcon from "../../shared/assets/Perfil.svg"
import { MobileSidebar } from "../MobileSidebar/MobileSidebar"
import styles from "./Navbar.module.css"

const visitorLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços e inspirações", href: "/servicos" },
]

const adminLinks = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/servicos" },
  { label: "Minha agenda", href: "/admin/agenda" },
  { label: "Meus serviços", href: "/admin/servicos" },
]

function getInitialTheme() {
  const storedTheme = window.localStorage.getItem("theme")

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function isActiveLink(href) {
  return window.location.pathname === href
}

export function Navbar({ role = "visitor", userName = "" }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isAdmin = role === "admin"
  const links = isAdmin ? adminLinks : visitorLinks
  const accountHref = isAdmin
    ? "/admin/agenda"
    : role === "client"
      ? "/perfil"
      : "/entrar"
  const accountLabel = isAdmin || role === "client"
    ? userName || (isAdmin ? "Minha conta" : "Meu perfil")
    : "Minha conta"

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("theme", theme)
  }, [theme])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header className={styles.header}>
        <div className={styles.content}>
          <div className={styles.leftArea}>
            <button
              className={styles.menuButton}
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Abrir menu de navegação"
              onClick={() => setIsMenuOpen(true)}
            >
              <img src={menuIcon} alt="" aria-hidden="true" />
            </button>

            <nav className={styles.desktopNavigation} aria-label="Navegação principal">
              {links.map((link) => (
                <a
                  className={`${styles.navLink} ${
                    isActiveLink(link.href) ? styles.active : ""
                  }`}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </a>
              ))}

              {!isAdmin && (
                <a
                  className={`${styles.navLink} ${
                    isActiveLink(accountHref) ? styles.active : ""
                  }`}
                  href={accountHref}
                >
                  Meus agendamentos
                </a>
              )}
            </nav>
          </div>

          <a className={styles.logo} href="/" aria-label="Nail Design - página inicial">
            <img src={logo} alt="Nail Design" />
          </a>

          <div className={styles.actions}>
            <button
              className={styles.themeButton}
              type="button"
              aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
              onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            >
              <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            </button>

            <a className={styles.accountLink} href={accountHref}>
              <img src={profileIcon} alt="" aria-hidden="true" />
              <span>{accountLabel}</span>
            </a>
          </div>
        </div>
      </header>

      <MobileSidebar
        accountHref={accountHref}
        isAdmin={isAdmin}
        isOpen={isMenuOpen}
        onClose={closeMenu}
      />
    </>
  )
}
