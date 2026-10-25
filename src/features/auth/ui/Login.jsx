import { useState } from "react"
import { loginUser } from "../../../shared/api/services/authApi"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { ButtonBack } from "../../../shared/ui/button-back/ButtonBack"
import { PasswordIcon } from "../../../shared/ui/icons/Icons"
import { Input } from "../../../shared/ui/text-input/Input"
import styles from "./Login.module.css"

export function Login() {
  const [formData, setFormData] = useState({
    identification: "",
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
      await loginUser(formData)
      setFeedback("Login realizado com sucesso.")
    } catch (error) {
      setFeedback(error instanceof Error
        ? error.message
        : "Não foi possível entrar na sua conta.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <ButtonBack href="/">Voltar</ButtonBack>

        <section className={styles.intro} aria-labelledby="login-title">
          <p className={styles.eyebrow}>BOM TER VOCÊ AQUI</p>
          <h1 id="login-title">Entre na sua conta</h1>
          <p className={styles.subtitle}>
            Seu próximo momento de cuidado começa aqui.
          </p>
        </section>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            autoComplete="username"
            label="Identificação"
            name="identification"
            onChange={updateField}
            placeholder="Sua identificação"
            required
            value={formData.identification}
          />
          <Input
            autoComplete="current-password"
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
            {isSubmitting ? "Entrando..." : "Entrar"}
          </ButtonAction>

          {feedback ? (
            <p className={styles.feedback} role="status">
              {feedback}
            </p>
          ) : null}
        </form>

        <p className={styles.registerPrompt}>
          Ainda não tem conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </div>
    </main>
  )
}
