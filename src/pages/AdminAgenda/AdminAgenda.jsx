import { useState } from "react"
import { ButtonAction } from "../../shared/ui/buttonAction/button"
import { Input } from "../../shared/ui/input/input"
import { getAdminAppointments } from "../../shared/api/services/profileApi"
import styles from "./AdminAgenda.module.css"

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h.1M12 14h.1M16 14h.1M8 17.5h.1M12 17.5h.1M16 17.5h.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function AdminAgenda() {
  const [date, setDate] = useState(today)
  const [feedback, setFeedback] = useState("")

  const handleDateChange = async (event) => {
    const selectedDate = event.target.value
    setDate(selectedDate)
    try {
      await getAdminAppointments(selectedDate)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível carregar a agenda.")
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>ESPAÇO DA PROFISSIONAL</p>
        <div className={styles.titleRow}>
          <h1>Minha agenda</h1>
          <ButtonAction href="/admin/servicos">Gerenciar serviços</ButtonAction>
        </div>
        <div className={styles.dateField}>
          <Input label="Escolha uma data" type="date" value={date} onChange={handleDateChange} />
        </div>
        <section className={styles.empty} aria-live="polite">
          <CalendarIcon />
          <p>Nenhum agendamento nesta data.</p>
        </section>
        {feedback && <p className={styles.feedback} role="status">{feedback}</p>}
      </div>
    </main>
  )
}
