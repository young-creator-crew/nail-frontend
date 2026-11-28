import { useEffect, useRef, useState } from "react"
import { loadClientProfile, resolveProfileUserId, saveClientProfile } from "../../features/profile/model/client-profile"
import { AppointmentTable } from "../../features/profile/ui/AppointmentTable"
import { ProfileDialogs } from "../../features/profile/ui/ProfileDialogs"
import { clearSessionUser, getSessionUser } from "../../shared/auth/session"
import { appointmentsEnabled, cancelAppointment, listAppointments, rescheduleAppointment } from "../../shared/api/services/appointmentApi"
import { ButtonAction } from "../../shared/ui/button-action/ButtonAction"
import { UserIcon } from "../../shared/ui/icons/Icons"
import { MarketingHeader } from "../../widgets/marketing-header/MarketingHeader"
import { MarketingFooter } from "../../widgets/marketing-footer/MarketingFooter"
import styles from "./ClientProfile.module.css"

const navigationLinks = [
  { label: "Serviços", href: "/servicos" },
  { label: "Inspirações", href: "/#inspiration" },
  { label: "Como funciona", href: "/#how-it-works" },
  { label: "Dúvidas", href: "/#faq" },
]
const footerNavigation = [
  { title: "Explore", links: [{ label: "Serviços", href: "/servicos" }, { label: "Agendar horário", href: "/agendamento" }] },
  { title: "Sua conta", links: [{ label: "Meu perfil", href: "/perfil" }] },
]

export function ClientProfile() {
  const [session, setSession] = useState(getSessionUser)
  const userId = resolveProfileUserId(session)
  const [profileState, setProfileState] = useState({ userId: null, reload: -1, data: null, error: "" })
  const [reload, setReload] = useState(0)
  const currentProfile = profileState.userId === userId && profileState.reload === reload
  const profile = currentProfile ? profileState.data : null
  const loadError = currentProfile ? profileState.error : ""
  const loading = Boolean(userId && !profile && !loadError)
  const [overlay, setOverlay] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [appointmentState, setAppointmentState] = useState({ userId: null, version: -1, upcoming: null, history: null, error: "" })
  const [appointmentVersion, setAppointmentVersion] = useState(0)
  const returnFocusRef = useRef(null)
  const sessionIdRef = useRef(userId)

  useEffect(() => {
    const restoreSession = () => {
      const nextSession = getSessionUser()
      const nextId = resolveProfileUserId(nextSession)
      if (nextId !== sessionIdRef.current) {
        setOverlay(null)
        setProfileState({ userId: null, reload: -1, data: null, error: "" })
        setFeedback("")
        sessionIdRef.current = nextId
      }
      setSession(nextSession)
    }
    window.addEventListener("nail-session-change", restoreSession)
    window.addEventListener("storage", restoreSession)
    return () => {
      window.removeEventListener("nail-session-change", restoreSession)
      window.removeEventListener("storage", restoreSession)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    if (!userId) return () => controller.abort()

    loadClientProfile(userId, { signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return
        setProfileState({ userId, reload, data: response, error: "" })
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setProfileState({
            userId,
            reload,
            data: null,
            error: error instanceof Error ? error.message : "Não foi possível carregar o perfil.",
          })
        }
      })
    return () => controller.abort()
  }, [userId, reload])

  useEffect(() => {
    if (!appointmentsEnabled || !userId) return
    const controller = new AbortController()
    Promise.all([
      listAppointments(userId, "upcoming", controller.signal),
      listAppointments(userId, "history", controller.signal),
    ]).then(([upcoming, history]) => {
      if (!controller.signal.aborted) setAppointmentState({ userId, version: appointmentVersion, upcoming, history, error: "" })
    }).catch((error) => {
      if (!controller.signal.aborted) setAppointmentState({
        userId, version: appointmentVersion, upcoming: null, history: null,
        error: error instanceof Error ? error.message : "Não foi possível carregar os agendamentos.",
      })
    })
    return () => controller.abort()
  }, [userId, appointmentVersion])

  const appointmentCurrent = appointmentState.userId === userId && appointmentState.version === appointmentVersion
  const appointmentsLoading = appointmentsEnabled && userId && !appointmentCurrent

  const openOverlay = (type, appointment, trigger) => {
    if (type !== "manage" && !appointment?.id) {
      setFeedback("Não foi possível identificar o agendamento.")
      return
    }
    if (trigger) returnFocusRef.current = trigger
    setFeedback("")
    setOverlay((current) => current?.type === "menu" && type === "menu" && current.appointment.id === appointment.id
      ? null
      : { type, appointment })
  }

  const closeOverlay = () => {
    if (!saving) setOverlay(null)
  }

  const saveProfile = async (draft) => {
    setSaving(true)
    try {
      const result = await saveClientProfile(userId, draft)
      setProfileState({ userId, reload, data: result, error: "" })
      setOverlay(null)
      setFeedback("Dados atualizados.")
    } finally {
      setSaving(false)
    }
  }

  const logout = () => {
    clearSessionUser()
    window.location.assign("/entrar")
  }

  const changeAppointment = async (type, values) => {
    if (!overlay?.appointment?.id || resolveProfileUserId(getSessionUser()) !== userId) {
      throw new Error("A sessão mudou. Entre novamente para continuar.")
    }
    setSaving(true)
    try {
      if (type === "cancel") await cancelAppointment(overlay.appointment.id)
      else await rescheduleAppointment(overlay.appointment.id, values)
      if (resolveProfileUserId(getSessionUser()) !== userId) throw new Error("A sessão mudou durante a operação. Confira o agendamento novamente.")
      setOverlay(null)
      setFeedback(type === "cancel" ? "Agendamento cancelado." : "Agendamento remarcado.")
      setAppointmentVersion((current) => current + 1)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <MarketingHeader
        navigationLinks={navigationLinks}
        loginHref="/perfil"
        loginLabel="Meu perfil"
        onLogout={session ? logout : undefined}
        logoutDisabled={saving}
        actionHref="/entrar"
        actionLabel="Entrar"
      />
      <main className={styles.main}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>SEU ESPAÇO DE CUIDADO</p>
          <h1>Meu perfil e agendamentos</h1>
          <p className={styles.description}>Gerencie seu perfil e acompanhe seus agendamentos.</p>
        </header>

        {!userId ? (
          <section className={styles.state} aria-label="Acesso ao perfil">
            <h2>Entre para acessar seu perfil</h2>
            <p>Não foi possível identificar uma sessão ativa. Entre na sua conta para continuar.</p>
            <ButtonAction className={styles.primary} href="/entrar">Entrar na minha conta</ButtonAction>
          </section>
        ) : loading ? (
          <p className={styles.state} role="status">Carregando perfil...</p>
        ) : loadError ? (
          <section className={styles.state} aria-label="Falha ao carregar perfil">
            <p className={styles.error} role="alert">{loadError}</p>
            <ButtonAction className={styles.primary} onClick={() => setReload((value) => value + 1)}>Tentar novamente</ButtonAction>
          </section>
        ) : profile && (
          <>
            <section className={styles.account} aria-labelledby="client-account-name">
              <div className={styles.accountDetails}>
                <p className={styles.eyebrow}>MINHA CONTA</p>
                <div className={styles.identity}>
                  <div className={styles.avatar}><UserIcon /></div>
                  <div className={styles.contacts}>
                    <h2 id="client-account-name">{profile.name || "Nome não informado"}</h2>
                    <dl>
                      <div><dt>Telefone:</dt><dd>{profile.phone || "Não informado"}</dd></div>
                      <div><dt>E-mail:</dt><dd>{profile.email || "Não informado"}</dd></div>
                    </dl>
                  </div>
                </div>
              </div>
              <ButtonAction
                className={styles.manage}
                onClick={(event) => openOverlay("manage", null, event.currentTarget)}
              >
                Gerenciar perfil
              </ButtonAction>
            </section>
            {feedback && <p className={styles.feedback} role="status">{feedback}</p>}
            <div className={styles.appointments}>
              {appointmentsLoading ? <p role="status">Carregando agendamentos...</p> : appointmentCurrent && appointmentState.error ? (
                <section className={styles.state}>
                  <p className={styles.error} role="alert">{appointmentState.error}</p>
                  <ButtonAction className={styles.primary} onClick={() => setAppointmentVersion((current) => current + 1)}>Tentar novamente</ButtonAction>
                </section>
              ) : (
                <>
                  <AppointmentTable
                    appointments={appointmentsEnabled && appointmentCurrent ? appointmentState.upcoming : null}
                    onAction={openOverlay}
                    activeAppointmentId={overlay?.type === "menu" ? overlay.appointment.id : null}
                    onCloseActions={closeOverlay}
                    returnFocusRef={returnFocusRef}
                  />
                  <AppointmentTable appointments={appointmentsEnabled && appointmentCurrent ? appointmentState.history : null} history />
                </>
              )}
            </div>
          </>
        )}
      </main>
      <MarketingFooter navigationGroups={footerNavigation} notice="Seu momento, do seu jeito." />
      {overlay && overlay.type !== "menu" && (
        <ProfileDialogs
          mode={overlay.type}
          profile={profile}
          appointment={overlay.appointment}
          onClose={closeOverlay}
          onBack={(type) => setOverlay((current) => ({ ...current, type }))}
          onSave={saveProfile}
          onCancel={appointmentsEnabled ? () => changeAppointment("cancel") : undefined}
          onReschedule={appointmentsEnabled ? (values) => changeAppointment("reschedule", values) : undefined}
          busy={saving}
          returnFocusRef={returnFocusRef}
        />
      )}
    </div>
  )
}
