export function formatDateId(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString('zh-CN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function parseDateId(dateId) {
  const [year, month, day] = dateId.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getMonthRange(year, month) {
  const paddedMonth = String(month).padStart(2, '0')
  return {
    start: `${year}-${paddedMonth}-01`,
    end: `${year}-${paddedMonth}-31`,
  }
}
