import styles from "./AppointmentBooking.module.css"

export function AppointmentBooking() {
  return (
    <p className={styles.timePrompt} role="status">
      O agendamento ainda não está integrado ao backend e está indisponível no momento.
    </p>
  )
}
