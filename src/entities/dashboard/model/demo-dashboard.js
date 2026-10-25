const DAY_MS = 24 * 60 * 60 * 1000

const createdValues = [5, 8, 7, 10, 9, 6, 8, 11, 9, 13, 10, 8, 12, 9, 14]
const completedValues = [4, 6, 6, 8, 7, 5, 7, 9, 8, 11, 8, 7, 10, 8, 12]

function parseDate(value) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date()
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getDemoDashboard({ endDate } = {}) {
  const end = parseDate(endDate)

  return {
    adminName: "Juliana Silva",
    cancelled: 6,
    previousCancelled: 8,
    completed: 111,
    averageTicket: 75,
    daily: createdValues.map((created, index) => {
      const date = new Date(end.getTime() - (14 - index) * DAY_MS)
      return {
        date: date.toISOString().slice(0, 10),
        created,
        completed: completedValues[index],
      }
    }),
  }
}
