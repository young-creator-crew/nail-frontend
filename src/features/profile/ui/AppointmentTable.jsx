import { useId } from "react"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { CalendarIcon } from "../../../shared/ui/icons/Icons"
import { formatAppointmentDate, formatAppointmentPrice } from "../model/appointment-display"
import { AppointmentActionsPopover } from "./AppointmentActionsPopover"
import styles from "./AppointmentTable.module.css"

export function AppointmentTable({ appointments, history = false, onAction, activeAppointmentId, onCloseActions, returnFocusRef }) {
  const headingId = useId()
  const unavailable = appointments === null
  const title = history ? "Histórico de agendamentos" : "Próximos agendamentos"

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.heading}>
        <div className={styles.title}>
          <h2 id={headingId}>{title}</h2>
          {!unavailable && <span className={styles.count} aria-label={`${appointments.length} agendamentos`}>{appointments.length}</span>}
        </div>
        {!history && !unavailable && appointments.length > 0 && (
          <ButtonAction className={styles.schedule} href="/servicos">Agendar</ButtonAction>
        )}
      </div>
      {unavailable || appointments.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.calendar}><CalendarIcon /></div>
          <div className={styles.emptyText}>
            <h3>{unavailable ? "Agendamentos indisponíveis no momento." : history ? "Seu histórico está vazio." : "Você ainda não tem próximos agendamentos."}</h3>
            <p>{unavailable
              ? "A integração com seus agendamentos ainda não está disponível."
              : history
                ? "Depois do seu primeiro cuidado, seus agendamentos aparecerão aqui."
                : "Escolha um serviço para encontrar um horário."}</p>
          </div>
          {!history && <ButtonAction className={styles.schedule} href="/servicos">Agendar</ButtonAction>}
        </div>
      ) : (
        <div className={styles.tablePanel}>
          <table className={styles.table} aria-labelledby={headingId}>
            <thead>
              <tr>
                <th scope="col">Data e horário</th>
                <th scope="col">Serviço</th>
                <th scope="col">Valor</th>
                <th scope="col">Status</th>
                {!history && onAction && <th scope="col"><span className={styles.srOnly}>Ações</span></th>}
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td data-label="Data e horário">
                    <time dateTime={`${appointment.date}T${appointment.time}`}>
                      <strong>{formatAppointmentDate(appointment.date)}</strong>
                      <span className={styles.time}>{appointment.time}</span>
                    </time>
                  </td>
                  <td data-label="Serviço"><strong>{appointment.service}</strong></td>
                  <td data-label="Valor"><strong>{formatAppointmentPrice(appointment.price)}</strong></td>
                  <td data-label="Status">
                    <span className={`${styles.status} ${appointment.status === "Cancelado" ? styles.cancelled : ""}`}>{appointment.status}</span>
                  </td>
                  {!history && onAction && (
                    <td className={styles.actionCell}>
                      <button
                        className={styles.more}
                        type="button"
                        aria-label={`Mais opções para ${appointment.service}`}
                        aria-expanded={activeAppointmentId === appointment.id}
                        aria-controls={activeAppointmentId === appointment.id ? `${headingId}-actions` : undefined}
                        onClick={(event) => onAction("menu", appointment, event.currentTarget)}
                      >
                        <span aria-hidden="true">⋯</span>
                      </button>
                      {activeAppointmentId === appointment.id && (
                        <AppointmentActionsPopover
                          id={`${headingId}-actions`}
                          onSelect={(type) => onAction(type, appointment)}
                          onClose={onCloseActions}
                          returnFocusRef={returnFocusRef}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
