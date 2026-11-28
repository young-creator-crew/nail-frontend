import { useState } from "react"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { Input } from "../../../shared/ui/text-input/Input"
import { CalendarIcon } from "../../../shared/ui/icons/Icons"
import styles from "./AdminAgenda.module.css"

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function AdminAgenda() {
  const [date, setDate] = useState(today)

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>ESPAÇO DA PROFISSIONAL</p>
        <div className={styles.titleRow}>
          <h1>Minha agenda</h1>
          <ButtonAction href="/admin/meus-servicos">Gerenciar serviços</ButtonAction>
        </div>
        <div className={styles.dateField}>
          <Input label="Escolha uma data" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <section className={styles.empty} aria-live="polite">
          <CalendarIcon />
          <p>A agenda administrativa ainda não está integrada ao backend.</p>
        </section>
      </div>
    </main>
  )
}
