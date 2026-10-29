import { useEffect, useState } from "react"
import { getProfile, updateProfile } from "../../../entities/profile/api/profileApi"
import { clearSessionUser, getSessionUser, setSessionUser } from "../../../shared/auth/session"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { CalendarIcon, UserIcon } from "../../../shared/ui/icons/Icons"
import { Input } from "../../../shared/ui/text-input/Input"
import styles from "./Perfil.module.css"

function resolveUserId(user) {
  return user?.id ?? user?.idNailUser ?? user?.idUser ?? null
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
  const sessionUser = getSessionUser()
  const sessionUserId = resolveUserId(sessionUser)
  const [profile, setProfile] = useState(sessionUser)
  const [draftName, setDraftName] = useState(sessionUser?.name ?? "")
  const [draftEmail, setDraftEmail] = useState(sessionUser?.email ?? "")
  const [draftPhone, setDraftPhone] = useState(sessionUser?.phone ?? "")
  const [isLoading, setIsLoading] = useState(Boolean(sessionUserId))
  const [isEditing, setIsEditing] = useState(false)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    if (!sessionUserId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    getProfile(sessionUserId)
      .then((result) => {
        setProfile(result)
        setDraftName(result.name)
        setDraftEmail(result.email)
        setDraftPhone(result.phone ?? "")

        const currentSession = getSessionUser() ?? {}
        setSessionUser({
          ...currentSession,
          ...result,
          id: resolveUserId(result) ?? sessionUserId,
        })
      })
      .catch((error) => setFeedback(error instanceof Error ? error.message : "Não foi possível carregar o perfil."))
      .finally(() => setIsLoading(false))
  }, [sessionUserId])

  const saveProfile = async (event) => {
    event.preventDefault()

    if (!sessionUserId) {
      setFeedback("Não foi possível identificar o usuário da sessão.")
      return
    }

    try {
      const result = await updateProfile(sessionUserId, {
        name: draftName,
        email: draftEmail,
        phone: draftPhone || null,
      })
      setProfile(result)

      const currentSession = getSessionUser() ?? {}
      setSessionUser({
        ...currentSession,
        ...result,
        id: resolveUserId(result) ?? sessionUserId,
      })

      setIsEditing(false)
      setFeedback("Dados atualizados.")
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível atualizar os dados.")
    }

  }

  const handleLogout = () => {
    clearSessionUser()
    window.location.assign("/entrar")
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

        {isLoading && <p role="status">Carregando perfil...</p>}
        {!isLoading && <section className={styles.profileCard} aria-label="Identificação do cliente">
          <div className={styles.profileInfo}>
            <div className={styles.avatar}><UserIcon /></div>
            <div>
              <h2>{profile?.name ?? sessionUser?.name ?? "Usuária"}</h2>
              <p>Um momento seu, sempre à mão.</p>
            </div>
          </div>
          <button className={styles.outlineButton} type="button" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? "Fechar edição" : "Editar perfil"}
          </button>
          <button className={styles.logoutButton} type="button" onClick={handleLogout}>
            Sair
          </button>
        </section>}

        {isEditing && (
          <form className={styles.editForm} onSubmit={saveProfile}>
            <Input label="Nome" value={draftName} onChange={(event) => setDraftName(event.target.value)} required />
            <Input label="E-mail" type="email" value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} required />
            <Input label="Telefone" value={draftPhone} onChange={(event) => setDraftPhone(event.target.value)} />
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
