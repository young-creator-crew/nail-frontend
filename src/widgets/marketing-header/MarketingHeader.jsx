import { useEffect, useId, useState } from "react"
import { ButtonAction } from "../../shared/ui/button-action/ButtonAction"
import { MoonIcon } from "../../shared/ui/icons/Icons"
import styles from "./MarketingHeader.module.css"

const defaultNavigationLinks = [
  { label: "Serviços", href: "#services" },
  { label: "Inspirações", href: "#inspiration" },
  { label: "Como funciona", href: "#how-it-works" },
  { label: "Dúvidas", href: "#faq" },
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

export function MarketingHeader({
  brandHref = "/",
  navigationLinks = defaultNavigationLinks,
  loginHref = "/entrar",
  loginLabel = "Entrar",
  actionHref = "/cadastro",
  actionLabel = "Criar conta",
}) {
  const navigationId = useId()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 0)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 0)

    window.addEventListener("scroll", updateScrollState, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollState)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.content}>
        <a className={styles.brand} href={brandHref} aria-label="Nicole Nails - página inicial">
          nicole nails<span>.</span>
        </a>

        <button
          className={styles.menuToggle}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls={navigationId}
          aria-label={isMenuOpen ? "Fechar navegação" : "Abrir navegação"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>

        <nav
          id={navigationId}
          className={`${styles.navigation} ${isMenuOpen ? styles.navigationOpen : ""}`}
          aria-label="Navegação da página"
        >
          {navigationLinks.map(({ href, label }) => (
            <a href={href} key={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <button
            className={styles.themeToggle}
            type="button"
            aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
            onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          >
            {theme === "light" ? <MoonIcon /> : <span aria-hidden="true">☀</span>}
          </button>
          <a className={styles.loginLink} href={loginHref}>{loginLabel}</a>
          <ButtonAction className={styles.createAccount} href={actionHref}>
            {actionLabel}
          </ButtonAction>
        </div>
      </div>
    </header>
  )
}
