import { startOfWeek } from 'date-fns/esm'

export const buildWeekId = (date: Date = new Date()) => {
  const base = startOfWeek(date)
  const year = base.getFullYear()
  const month = String(base.getMonth()).padStart(2, '0')
  const day = String(base.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}
