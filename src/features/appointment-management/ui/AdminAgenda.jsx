import { useState } from "react"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { Input } from "../../../shared/ui/text-input/Input"
import { getAdminAppointments } from "../../../entities/appointment/api/appointmentApi"
import { CalendarIcon } from "../../../shared/ui/icons/Icons"
import styles from "./AdminAgenda.module.css"

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
          <ButtonAction href="/admin/meus-servicos">Gerenciar serviços</ButtonAction>
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
