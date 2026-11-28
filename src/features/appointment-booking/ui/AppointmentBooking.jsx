import { useEffect, useRef, useState } from "react"
import { getServiceById } from "../../../entities/service/api/serviceApi"
import { appointmentsEnabled, createAppointment, getAvailableTimes } from "../../../shared/api/services/appointmentApi"
import { getSessionUser } from "../../../shared/auth/session"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { ClockIcon } from "../../../shared/ui/icons/Icons"
import { resolveProfileUserId } from "../../profile/model/client-profile"
import styles from "./AppointmentBooking.module.css"

const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" })
const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getCalendarDays(month) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstWeekday = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstWeekday + 1
    return day > 0 && day <= daysInMonth ? day : null
  })
}

export function AppointmentBooking() {
  const serviceId = new URLSearchParams(window.location.search).get("serviceId")
  const [serviceState, setServiceState] = useState({ id: null, data: null, error: "" })
  const [availability, setAvailability] = useState({ date: "", version: -1, times: null, error: "" })
  const [availabilityVersion, setAvailabilityVersion] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const submitLock = useRef(false)
  const [today] = useState(() => new Date())
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const calendarDays = getCalendarDays(visibleMonth)
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const dateKey = selectedDate ? getDateKey(selectedDate) : ""
  const service = serviceState.id === serviceId ? serviceState.data : null
  const currentAvailability = availability.date === dateKey && availability.version === availabilityVersion
  const timeLoading = Boolean(dateKey && service && !currentAvailability)
  const times = currentAvailability ? availability.times : null
  const userId = resolveProfileUserId(getSessionUser())

  useEffect(() => {
    if (!appointmentsEnabled || !serviceId) return
    const controller = new AbortController()
    getServiceById(serviceId, { signal: controller.signal }).then((result) => {
      if (!result?.active || !result?.idNailService || typeof result.serviceName !== "string"
        || !Array.isArray(result.options) || !Number.isFinite(result.options[0]?.price)) {
        throw new Error("Este serviço não está disponível para agendamento.")
      }
      if (!controller.signal.aborted) setServiceState({ id: serviceId, data: result, error: "" })
    }).catch((error) => {
      if (!controller.signal.aborted) setServiceState({ id: serviceId, data: null, error: error instanceof Error ? error.message : "Não foi possível carregar o serviço." })
    })
    return () => controller.abort()
  }, [serviceId])

  useEffect(() => {
    if (!appointmentsEnabled || !service || !dateKey) return
    const controller = new AbortController()
    getAvailableTimes(service.idNailService, dateKey, controller.signal).then((result) => {
      if (!controller.signal.aborted) setAvailability({ date: dateKey, version: availabilityVersion, times: result, error: "" })
    }).catch((error) => {
      if (!controller.signal.aborted) setAvailability({ date: dateKey, version: availabilityVersion, times: null, error: error instanceof Error ? error.message : "Não foi possível carregar os horários." })
    })
    return () => controller.abort()
  }, [service, dateKey, availabilityVersion])

  const changeMonth = (offset) => {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1))
    setSelectedDate(null)
    setSelectedTime("")
    setIsConfirmed(false)
    setErrorMessage("")
  }

  const selectDate = (date) => {
    setSelectedDate(date)
    setSelectedTime("")
    setIsConfirmed(false)
    setErrorMessage("")
  }

  const handleConfirm = async () => {
    if (submitLock.current || !service || !dateKey || !selectedTime) return
    const currentUserId = resolveProfileUserId(getSessionUser())
    if (!currentUserId || currentUserId !== userId) {
      setErrorMessage("Entre na sua conta antes de confirmar o agendamento.")
      return
    }
    submitLock.current = true
    setSubmitting(true)
    setErrorMessage("")
    try {
      await createAppointment({ userId: currentUserId, serviceId: service.idNailService, date: dateKey, time: selectedTime })
      if (resolveProfileUserId(getSessionUser()) !== currentUserId) throw new Error("A sessão mudou durante a reserva. Confira o agendamento na conta original.")
      setIsConfirmed(true)
      setAvailabilityVersion((current) => current + 1)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível agendar.")
      setSelectedTime("")
      setAvailabilityVersion((current) => current + 1)
    } finally {
      submitLock.current = false
      setSubmitting(false)
    }
  }

  if (!appointmentsEnabled) return <p className={styles.timePrompt} role="status">O agendamento ainda não está integrado ao backend e está indisponível no momento.</p>
  if (!serviceId) return <p className={styles.timePrompt}>Escolha um serviço no <a href="/servicos">catálogo de serviços</a> para agendar.</p>
  if (serviceState.id !== serviceId) return <p role="status">Carregando serviço...</p>
  if (serviceState.error) return <p role="alert">{serviceState.error} <a href="/servicos">Voltar aos serviços</a></p>

  return (
    <section className={styles.booking} aria-label="Escolha a data do atendimento">
      <article className={styles.serviceSummary} aria-label="Serviço selecionado">
        {service.photoUrl ? <img className={styles.serviceImage} src={service.photoUrl} alt={service.serviceName} /> : <div className={styles.serviceImage} aria-hidden="true" />}
        <div className={styles.serviceText}>
          <p className={styles.serviceEyebrow}>Seu serviço</p>
          <h2 className={styles.serviceName}>{service.serviceName}</h2>
        </div>
        <strong className={styles.servicePrice}>{currencyFormatter.format(service.options[0].price)}</strong>
      </article>

      <section className={styles.calendarSection} aria-labelledby="calendar-heading">
        <h2 className={styles.sectionTitle} id="calendar-heading">Escolha uma data</h2>
        <div className={styles.monthNavigation}>
          <button className={styles.monthButton} type="button" aria-label="Mês anterior" disabled={visibleMonth <= currentMonth || submitting} onClick={() => changeMonth(-1)}><span aria-hidden="true">‹</span></button>
          <h3 className={styles.monthTitle} aria-live="polite">{monthFormatter.format(visibleMonth)}</h3>
          <button className={styles.monthButton} type="button" aria-label="Próximo mês" disabled={submitting} onClick={() => changeMonth(1)}><span aria-hidden="true">›</span></button>
        </div>
        <div className={styles.calendar} role="group" aria-label="Calendário">
          {weekdayLabels.map((weekday) => <div className={styles.weekday} aria-hidden="true" key={weekday}>{weekday}</div>)}
          {calendarDays.map((day, index) => {
            if (day === null) return <span className={styles.emptyDay} aria-hidden="true" key={`empty-${index}`} />
            const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day)
            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const isSelected = selectedDate && getDateKey(selectedDate) === getDateKey(date)
            return (
              <div className={styles.dayCell} key={getDateKey(date)}>
                <button
                  className={`${styles.dayButton} ${isPast ? styles.dayUnavailable : ""} ${isSelected ? styles.daySelected : ""}`}
                  type="button"
                  aria-label={dateFormatter.format(date)}
                  aria-pressed={Boolean(isSelected)}
                  aria-current={getDateKey(today) === getDateKey(date) ? "date" : undefined}
                  disabled={isPast || submitting}
                  onClick={() => selectDate(date)}
                >{day}</button>
              </div>
            )
          })}
        </div>
      </section>

      <section className={styles.timeSection} aria-labelledby="times-heading">
        <div className={styles.timeHeading}><ClockIcon /><h2 className={styles.sectionTitle} id="times-heading">Horários disponíveis</h2></div>
        {selectedDate ? (
          <div className={styles.timeOptions}>
            <p className={styles.timePrompt}>{dateFormatter.format(selectedDate)} · Selecione um horário.</p>
            <div className={styles.timeList} aria-label="Horários disponíveis">
              {times?.map((time) => (
                <button className={`${styles.timeButton} ${selectedTime === time ? styles.timeSelected : ""}`} type="button" aria-pressed={selectedTime === time} key={time} disabled={submitting} onClick={() => { setSelectedTime(time); setIsConfirmed(false) }}>{time}</button>
              ))}
            </div>
            {timeLoading && <p role="status">Carregando horários...</p>}
            {currentAvailability && availability.error && <p role="alert">{availability.error} <button type="button" onClick={() => setAvailabilityVersion((current) => current + 1)}>Tentar novamente</button></p>}
            {times?.length === 0 && <p>Nenhum horário disponível nesta data.</p>}
          </div>
        ) : <p className={styles.timePrompt}>Selecione uma data para ver os horários.</p>}
        <div className={styles.confirmation}>
          <ButtonAction className={styles.confirmButton} disabled={!selectedDate || !selectedTime || isConfirmed || submitting || !userId || timeLoading} icon={<span aria-hidden="true">→</span>} onClick={handleConfirm}>
            {submitting ? "Confirmando..." : isConfirmed ? "Agendamento confirmado" : "Confirmar agendamento"}
          </ButtonAction>
          {!userId && <p>Entre na sua conta para agendar: <a href="/entrar">Entrar</a>.</p>}
          {errorMessage && <p role="alert">{errorMessage}</p>}
          <p className={styles.reservationNote} role="status" aria-live="polite">
            {isConfirmed && selectedDate && selectedTime ? `Horário de ${selectedTime} em ${dateFormatter.format(selectedDate)} reservado.` : "O horário será reservado após a confirmação."}
          </p>
          {isConfirmed && <a href="/perfil">Ver meus agendamentos</a>}
        </div>
      </section>
    </section>
  )
}
