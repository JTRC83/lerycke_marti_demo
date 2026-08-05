// Shared formatting helpers for the new-project flow.

// Formats an ISO date string (or Date) as "dd/mm/yyyy HH:MM" (es-ES).
export function formatFechaEs(fecha) {
  const d = fecha instanceof Date ? fecha : new Date(fecha)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Current month as "YYYY-MM" for the project fecha field.
export function currentYYYYMM() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

// Unique id for a multimedia history entry.
export function medId() {
  return `med-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}