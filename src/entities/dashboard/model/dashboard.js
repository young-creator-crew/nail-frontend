const DAY_MS = 24 * 60 * 60 * 1000
const DEMO_TICKET = 75

function normalizeDailyEntry(entry) {
  if (!entry || !entry.date) {
    throw new Error("A API retornou um dia inválido para o dashboard.")
  }

  return {
    date: new Date(`${entry.date}T00:00:00`),
    created: Number(entry.created),
    completed: Number(entry.completed),
  }
}

export function normalizeDashboardData(response) {
  if (!response || !Array.isArray(response.daily)) {
    throw new Error("A API retornou dados inválidos para o dashboard.")
  }

  const data = {
    adminName: response.adminName || "Juliana",
    cancelled: Number(response.cancelled),
    previousCancelled: Number(response.previousCancelled),
    completed: Number(response.completed),
    averageTicket: Number(response.averageTicket || DEMO_TICKET),
    daily: response.daily.map(normalizeDailyEntry),
  }

  if (
    !Number.isFinite(data.cancelled)
    || !Number.isFinite(data.previousCancelled)
    || !Number.isFinite(data.completed)
    || !Number.isFinite(data.averageTicket)
    || data.daily.some((entry) => !Number.isFinite(entry.created) || !Number.isFinite(entry.completed))
  ) {
    throw new Error("A API retornou indicadores inválidos para o dashboard.")
  }

  return data
}

export function getDashboardMetrics(data, visibleDays = 15) {
  const daily = data.daily.slice(-visibleDays)
  const createdTotal = daily.reduce((total, item) => total + item.created, 0)
  const completedTotal = daily.reduce((total, item) => total + item.completed, 0)
  const busiest = daily.reduce((current, item) => (
    !current || item.created > current.created ? item : current
  ), null)
  const cancellationChange = data.previousCancelled
    ? Math.round(((data.cancelled - data.previousCancelled) / data.previousCancelled) * 100)
    : 0

  return { daily, createdTotal, completedTotal, busiest, cancellationChange }
}

export function dateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function periodFor(date = new Date()) {
  const end = dateOnly(date)
  return { start: new Date(end.getTime() - 14 * DAY_MS), end }
}

export function shiftPeriod(period, days) {
  return {
    start: new Date(period.start.getTime() + days * DAY_MS),
    end: new Date(period.end.getTime() + days * DAY_MS),
  }
}
