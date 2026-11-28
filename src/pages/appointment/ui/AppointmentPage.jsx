import { AppointmentBooking } from "../../../features/appointment-booking/ui/AppointmentBooking"
import { ButtonBack } from "../../../shared/ui/button-back/ButtonBack"
import styles from "./AppointmentPage.module.css"

export function AppointmentPage() {
  const serviceId = new URLSearchParams(window.location.search).get("serviceId")
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <ButtonBack className={styles.backLink} href={serviceId ? `/servicos/${encodeURIComponent(serviceId)}` : "/servicos"}>
          {serviceId ? "Voltar ao serviço" : "Voltar aos serviços"}
        </ButtonBack>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Um tempo para você</p>
          <h1 className={styles.title}>Agendar atendimento</h1>
        </header>

        <AppointmentBooking />
      </div>
    </main>
  )
}
