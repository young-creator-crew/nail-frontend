import { useState } from "react"
import { registerUser } from "../../../shared/api/services/authApi"
import { setSessionUser } from "../../../shared/auth/session"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { ButtonBack } from "../../../shared/ui/button-back/ButtonBack"
import { PasswordIcon } from "../../../shared/ui/icons/Icons"
import { Input } from "../../../shared/ui/text-input/Input"
import styles from "./Cadastro.module.css"

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
    <main className={styles.page}>
      <div className={styles.content}>
        <ButtonBack href="/">Voltar</ButtonBack>

        <section className={styles.intro} aria-labelledby="register-title">
          <p className={styles.eyebrow}>SEU PRIMEIRO PASSO</p>
          <h1 id="register-title">Crie sua conta</h1>
          <p className={styles.subtitle}>
            Seu próximo momento de cuidado começa aqui.
          </p>
        </section>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            autoComplete="name"
            label="Nome"
            name="name"
            onChange={updateField}
            placeholder="Como podemos chamar você?"
            required
            value={formData.name}
          />
          <Input
            autoComplete="username"
            label="E-mail"
            name="email"
            onChange={updateField}
            placeholder="seu@email.com"
            required
            value={formData.email}
          />
          <Input
            autoComplete="new-password"
            endAdornment={
              <button
                className={styles.passwordToggle}
                type="button"
                aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setIsPasswordVisible((current) => !current)}
              >
                <PasswordIcon isVisible={isPasswordVisible} />
              </button>
            }
            label="Senha"
            name="password"
            onChange={updateField}
            placeholder="Digite sua senha"
            required
            type={isPasswordVisible ? "text" : "password"}
            value={formData.password}
          />

          <ButtonAction disabled={isSubmitting} icon="→" type="submit">
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </ButtonAction>

          {feedback ? (
            <p className={styles.feedback} role="status">
              {feedback}
            </p>
          ) : null}
        </form>

        <p className={styles.loginPrompt}>
          Já tem conta? <a href="/entrar">Entrar</a>
        </p>
      </div>
    </main>
  )
}
