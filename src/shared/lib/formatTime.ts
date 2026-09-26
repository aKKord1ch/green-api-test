const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

export function formatTime(timestamp: number): string {
  return timeFormatter.format(timestamp)
}

/** Для списка чатов: сегодня — время, иначе — дата. */
export function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  return isToday ? timeFormatter.format(date) : dateFormatter.format(date)
}
