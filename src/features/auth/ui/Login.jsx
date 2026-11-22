import { useState } from "react"
import { loginUser } from "../../../shared/api/services/authApi"
import { setSessionUser } from "../../../shared/auth/session"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { Input } from "../../../shared/ui/text-input/Input"
import { AuthPageLayout } from "./AuthPageLayout"
import styles from "./AuthForm.module.css"

export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState("")

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setFeedback("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback("")

    try {
      const user = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })
      setSessionUser(user)
      window.location.assign(user.userType === "ADMIN" ? "/admin/dashboard" : "/perfil")
    } catch (error) {
      setFeedback(error instanceof Error
        ? error.message
        : "Não foi possível entrar na sua conta.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageLayout
      formLabel="Acesso à conta"
      imageAlt="Retrato de uma mulher em um momento de beleza e cuidado"
      imageSrc="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85"
      visualEyebrow="BOM TER VOCÊ POR PERTO"
      visualTitle={
        <>
          <span>Beleza que se vê.</span>
          <em>Cuidado que se sente.</em>
        </>
      }
    >
      <section className={styles.formSection} aria-labelledby="login-title">
        <p className={styles.eyebrow}>BOM TER VOCÊ AQUI</p>
        <h1 id="login-title" className={styles.title}>Entre na sua conta</h1>
        <p className={styles.subtitle}>
          Seu próximo momento de cuidado começa aqui.
        </p>
        <p className={styles.careNote}>Seu próximo cuidado</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <Input
              autoComplete="email"
              aria-describedby="login-email-help"
              className={styles.input}
              label="E-mail"
              labelClassName={styles.label}
              name="email"
              onChange={updateField}
              placeholder="seu@email.com"
              required
              type="email"
              value={formData.email}
            />
            <p className={styles.helper} id="login-email-help">
              Use o e-mail da sua conta.
            </p>
          </div>
          <div className={styles.fieldGroup}>
            <Input
              autoComplete="current-password"
              aria-describedby="login-password-help"
              className={styles.input}
              endAdornment={
                <button
                  className={styles.passwordToggle}
                  type="button"
                  aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setIsPasswordVisible((current) => !current)}
                >
                  {isPasswordVisible ? "Ocultar" : "Mostrar"}
                </button>
              }
              label="Senha"
              labelClassName={styles.label}
              name="password"
              onChange={updateField}
              placeholder="Digite sua senha"
              required
              type={isPasswordVisible ? "text" : "password"}
              value={formData.password}
            />
            <p className={styles.helper} id="login-password-help">
              Use a senha da sua conta.
            </p>
          </div>

          <ButtonAction className={styles.submit} disabled={isSubmitting} type="submit">
            {isSubmitting ? "Entrando..." : "Entrar"}
          </ButtonAction>

          {feedback ? (
            <p className={styles.feedback} role="status">
              {feedback}
            </p>
          ) : null}
        </form>

        <p className={styles.accountPrompt}>
          Ainda não tem conta?
          <a href="/cadastro">Cadastre-se ↗</a>
        </p>
      </section>
    </AuthPageLayout>
  )
}
