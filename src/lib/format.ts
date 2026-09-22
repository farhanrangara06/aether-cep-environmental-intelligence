export function fmt(n: number, digits = 1) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

export function fmtInt(n: number) {
  if (!Number.isFinite(n)) return '—'
  return Math.round(n).toLocaleString()
}

export function timeAgo(iso?: string) {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.max(0, Math.round(ms / 60000))
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 48) return `${h}h ago`
  return new Date(iso).toLocaleString()
}

export function observedAt(iso?: string) {
  if (!iso) return 'pending'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function mean(values: number[]) {
  const v = values.filter((x) => Number.isFinite(x))
  if (!v.length) return Number.NaN
  return v.reduce((a, b) => a + b, 0) / v.length
}
