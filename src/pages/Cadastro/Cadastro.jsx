import { useState } from "react"
import { registerUser } from "../../shared/api/services/authApi"
import { ButtonAction } from "../../shared/ui/buttonAction/button"
import { ButtonBack } from "../../shared/ui/buttonBack/button"
import { Input } from "../../shared/ui/input/input"
import styles from "./Cadastro.module.css"

function PasswordIcon({ isVisible }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {isVisible ? (
        <path
          d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 9 5.6 9 7s-3.8 7-9 7a9.9 9.9 0 0 1-4.8-1.3M4.4 8.1C2.9 9.5 2 11.1 2 12c0 1.4 3.8 7 10 7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      ) : (
        <path
          d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      )}
    </svg>
  )
}

export function Cadastro() {
  const [formData, setFormData] = useState({
    name: "",
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
      await registerUser(formData)
      setFeedback("Cadastro realizado com sucesso.")
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
            label="Identificação"
            name="identification"
            onChange={updateField}
            placeholder="Sua identificação"
            required
            value={formData.identification}
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
