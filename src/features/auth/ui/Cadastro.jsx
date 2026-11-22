import { useState } from "react"
import { registerUser } from "../../../shared/api/services/authApi"
import { setSessionUser } from "../../../shared/auth/session"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { Input } from "../../../shared/ui/text-input/Input"
import { AuthPageLayout } from "./AuthPageLayout"
import styles from "./AuthForm.module.css"

export function Cadastro() {
  const [formData, setFormData] = useState({
    name: "",
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
      const user = await registerUser(formData)
      setSessionUser(user)
      window.location.assign(user.userType === "ADMIN" ? "/admin/dashboard" : "/perfil")
    } catch (error) {
      setFeedback(error instanceof Error
        ? error.message
        : "Não foi possível concluir o cadastro.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageLayout
      formLabel="Cadastro de conta"
      imageAlt="Frascos de esmalte em uma composição de cuidado pessoal"
      imageSrc="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85"
      visualEyebrow="UM NOVO MOMENTO COMEÇA AQUI"
      visualTitle={
        <>
          <span>Um tempo</span>
          <em>só para você.</em>
        </>
      }
    >
      <section className={styles.formSection} aria-labelledby="register-title">
        <p className={styles.eyebrow}>SEU PRIMEIRO PASSO</p>
        <h1 id="register-title" className={styles.title}>Crie sua conta</h1>
        <p className={styles.subtitle}>
          Seu próximo momento de cuidado começa aqui.
        </p>
        <p className={styles.careNote}>Seu próximo cuidado</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
          <Input
            autoComplete="name"
              aria-describedby="register-name-help"
              className={styles.input}
            label="Nome"
              labelClassName={styles.label}
            name="name"
            onChange={updateField}
            placeholder="Como podemos chamar você?"
            required
            value={formData.name}
          />
          <p className={styles.helper} id="register-name-help">
            O nome que você quer ver no seu perfil.
          </p>
          </div>
          <div className={styles.fieldGroup}>
          <Input
              autoComplete="email"
              aria-describedby="register-email-help"
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
          <p className={styles.helper} id="register-email-help">
            Escolha o e-mail que usará para entrar.
          </p>
          </div>
          <div className={styles.fieldGroup}>
          <Input
            autoComplete="new-password"
              aria-describedby="register-password-help"
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
            className={styles.input}
            label="Senha"
            labelClassName={styles.label}
            name="password"
            onChange={updateField}
            placeholder="Digite sua senha"
            required
            type={isPasswordVisible ? "text" : "password"}
            value={formData.password}
          />
            <p className={styles.helper} id="register-password-help">
              Prefira uma senha única e difícil de adivinhar.
            </p>
          </div>

          <ButtonAction className={styles.submit} disabled={isSubmitting} type="submit">
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </ButtonAction>

          {feedback ? (
            <p className={styles.feedback} role="status">
              {feedback}
            </p>
          ) : null}
        </form>

        <p className={styles.accountPrompt}>
          Já tem conta?
          <a href="/entrar">Entrar na minha conta ↗</a>
        </p>
      </section>
    </AuthPageLayout>
  )
}
