import { useState } from "react"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { ClockIcon } from "../../../shared/ui/icons/Icons"
import { demoAppointment, demoAvailableTimes } from "../model/demo-appointment"
import styles from "./AppointmentBooking.module.css"

const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
})
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
})
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function isSameDate(first, second) {
  return getDateKey(first) === getDateKey(second)
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
  const [today] = useState(() => new Date())
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const calendarDays = getCalendarDays(visibleMonth)
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const canGoToPreviousMonth = visibleMonth > currentMonth

  const changeMonth = (offset) => {
    setVisibleMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1),
    )
    setSelectedDate(null)
    setSelectedTime("")
    setIsConfirmed(false)
  }

  const selectDate = (date) => {
    setSelectedDate(date)
    setSelectedTime("")
    setIsConfirmed(false)
  }

  const handleConfirm = () => {
    setIsConfirmed(true)
  }

  return (
    <section className={styles.booking} aria-label="Escolha a data do atendimento">
      <article className={styles.serviceSummary} aria-label="Serviço selecionado">
        <img
          className={styles.serviceImage}
          src={demoAppointment.image}
          alt={demoAppointment.imageAlt}
        />
        <div className={styles.serviceText}>
          <p className={styles.serviceEyebrow}>{demoAppointment.serviceCategory}</p>
          <h2 className={styles.serviceName}>{demoAppointment.serviceName}</h2>
        </div>
        <strong className={styles.servicePrice}>
          {currencyFormatter.format(demoAppointment.price)}
        </strong>
      </article>

      <section className={styles.calendarSection} aria-labelledby="calendar-heading">
        <h2 className={styles.sectionTitle} id="calendar-heading">
          Escolha uma data
        </h2>

        <div className={styles.monthNavigation}>
          <button
            className={styles.monthButton}
            type="button"
            aria-label="Mês anterior"
            disabled={!canGoToPreviousMonth}
            onClick={() => changeMonth(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <h3 className={styles.monthTitle} aria-live="polite">
            {monthFormatter.format(visibleMonth)}
          </h3>
          <button
            className={styles.monthButton}
            type="button"
            aria-label="Próximo mês"
            onClick={() => changeMonth(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className={styles.calendar} role="group" aria-label="Calendário">
          {weekdayLabels.map((weekday) => (
            <div className={styles.weekday} aria-hidden="true" key={weekday}>
              {weekday}
            </div>
          ))}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <span
                  className={styles.emptyDay}
                  aria-hidden="true"
                  key={`empty-${index}`}
                />
              )
            }

            const date = new Date(
              visibleMonth.getFullYear(),
              visibleMonth.getMonth(),
              day,
            )
            const isPast =
              date <
              new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const isSunday = date.getDay() === 0
            const isUnavailable = isPast || isSunday
            const isSelected = selectedDate && isSameDate(date, selectedDate)
            const isToday = isSameDate(date, today)

            return (
              <div className={styles.dayCell} key={getDateKey(date)}>
                <button
                  className={`${styles.dayButton} ${
                    isUnavailable ? styles.dayUnavailable : ""
                  } ${isSelected ? styles.daySelected : ""}`}
                  type="button"
                  aria-label={dateFormatter.format(date)}
                  aria-pressed={Boolean(isSelected)}
                  aria-current={isToday ? "date" : undefined}
                  disabled={isUnavailable}
                  onClick={() => selectDate(date)}
                >
                  {day}
                </button>
              </div>
            )
          })}
        </div>

        <p className={styles.availabilityNote}>
          <span aria-hidden="true" />
          Atendimentos de segunda a sábado
        </p>
      </section>

      <section className={styles.timeSection} aria-labelledby="times-heading">
        <div className={styles.timeHeading}>
          <ClockIcon />
          <h2 className={styles.sectionTitle} id="times-heading">
            Horários disponíveis
          </h2>
        </div>

        {selectedDate ? (
          <div className={styles.timeOptions}>
            <p className={styles.timePrompt}>
              {dateFormatter.format(selectedDate)} · Selecione um horário.
            </p>
            <div className={styles.timeList} aria-label="Horários disponíveis">
              {demoAvailableTimes.map((time) => (
                <button
                  className={`${styles.timeButton} ${
                    selectedTime === time ? styles.timeSelected : ""
                  }`}
                  type="button"
                  aria-pressed={selectedTime === time}
                  key={time}
                  onClick={() => {
                    setSelectedTime(time)
                    setIsConfirmed(false)
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className={styles.timePrompt}>
            Selecione uma data para ver os horários.
          </p>
        )}

        <div className={styles.confirmation}>
          <ButtonAction
            className={styles.confirmButton}
            disabled={!selectedDate || !selectedTime || isConfirmed}
            icon={<span aria-hidden="true">→</span>}
            onClick={handleConfirm}
          >
            {isConfirmed ? "Agendamento confirmado" : "Confirmar agendamento"}
          </ButtonAction>
          <p className={styles.reservationNote} role="status" aria-live="polite">
            {isConfirmed && selectedDate && selectedTime
              ? `Horário de ${selectedTime} em ${dateFormatter.format(selectedDate)} reservado como demonstração.`
              : "O horário será reservado após a confirmação."}
          </p>
        </div>
      </section>
    </section>
  )
}
