const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
const priceFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function formatAppointmentDate(dateKey) {
  const parts = dateFormatter.formatToParts(new Date(`${dateKey}T12:00:00`))
  const part = (type) => parts.find((value) => value.type === type).value
  return `${part("day")} ${part("month").replace(".", "")} ${part("year")}`
}

export function formatAppointmentPrice(price) {
  return priceFormatter.format(price)
}
