import { useState } from "react"
import { updateClientProfile } from "../../shared/api/services/profileApi"
import { ButtonAction } from "../../shared/ui/buttonAction/button"
import { Input } from "../../shared/ui/input/input"
import styles from "./Perfil.module.css"

function UserIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M5.5 20c.4-3.5 2.4-5.4 6.5-5.4s6.1 1.9 6.5 5.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h.1M12 14h.1M16 14h.1M8 17.5h.1M12 17.5h.1M16 17.5h.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
}

function EmptyAppointments({ history = false }) {
  return (
    <div className={styles.empty}>
      <CalendarIcon />
      <p>{history ? "Seu histórico está vazio." : "Você ainda não tem próximos agendamentos."}</p>
      {!history && <a href="/servicos">Ver serviços <span aria-hidden="true">→</span></a>}
    </div>
  )
}

export function Perfil({ isAdmin = false }) {
  const [profile, setProfile] = useState({
    name: isAdmin ? "[NOME DA ADMINISTRADORA]" : "[NOME DO CLIENTE]",
    password: "",
  })
  const [draftName, setDraftName] = useState(profile.name)
  const [isEditing, setIsEditing] = useState(false)
  const [feedback, setFeedback] = useState("")

  const saveProfile = async (event) => {
    event.preventDefault()
    try {
      await updateClientProfile({ name: draftName, password: profile.password })
      setProfile((current) => ({ ...current, name: draftName }))
      setIsEditing(false)
      setFeedback("Dados atualizados.")
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível atualizar os dados.")
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>
          {isAdmin ? "ESPAÇO DA PROFISSIONAL" : "SEU ESPAÇO DE CUIDADO"}
        </p>
        <h1>
          {isAdmin ? "Meu perfil" : <>Meu perfil e<br className={styles.mobileBreak} /> agendamentos</>}
        </h1>

        <section className={styles.profileCard} aria-label="Identificação do cliente">
          <div className={styles.profileInfo}>
            <div className={styles.avatar}><UserIcon /></div>
            <div>
              <h2>{profile.name}</h2>
              <p>Um momento seu, sempre à mão.</p>
            </div>
          </div>
          <button className={styles.outlineButton} type="button" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? "Fechar edição" : "Editar perfil"}
          </button>
        </section>

        {isEditing && (
          <form className={styles.editForm} onSubmit={saveProfile}>
            <Input label="Nome" value={draftName} onChange={(event) => setDraftName(event.target.value)} required />
            <Input label="Alterar senha" placeholder="Nova senha (simulada)" type="password" />
            <ButtonAction icon="">Salvar alterações</ButtonAction>
          </form>
        )}

        {!isAdmin && <section className={styles.appointmentSection}>
          <div className={styles.sectionHeading}><h2>Próximos agendamentos</h2><span>0</span></div>
          <EmptyAppointments />
        </section>}

        {!isAdmin && <section className={styles.appointmentSection}>
          <div className={styles.sectionHeading}><h2>Histórico de agendamentos</h2><span>0</span></div>
          <EmptyAppointments history />
        </section>}
      </div>
      {feedback && <div className={styles.toast} role="status"><span>✓</span>{feedback}<button type="button" aria-label="Fechar mensagem" onClick={() => setFeedback("")}>×</button></div>}
    </main>
  )
}
