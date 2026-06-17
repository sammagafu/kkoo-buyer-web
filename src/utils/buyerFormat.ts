export function formatBuyerMoney(value: unknown, fallback = '—') {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(n)
}

export function formatBuyerDateTime(value: unknown) {
  if (!value) return '—'
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString()
}

export function formatBuyerDistance(value: unknown) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return ''
  if (n < 1) return `${Math.round(n * 1000)} m away`
  return `${n.toFixed(1)} km away`
}

export function orderStatusPillClass(status: unknown) {
  const s = String(status ?? '').toLowerCase()
  if (s === 'delivered' || s === 'completed') return 'buyer-status-pill buyer-status-pill--ok'
  if (s === 'cancelled' || s === 'refunded') return 'buyer-status-pill'
  if (s === 'shipped' || s === 'processing' || s === 'confirmed') return 'buyer-status-pill buyer-status-pill--warn'
  return 'buyer-status-pill'
}

export function flashSaleCountdown(endAt: string, now = Date.now()) {
  const end = new Date(endAt).getTime()
  const diff = end - now
  if (!Number.isFinite(end) || diff <= 0) return 'Ended'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1000)
  if (h > 48) {
    const days = Math.floor(h / 24)
    return `${days}d ${h % 24}h left`
  }
  if (h > 0) return `${h}h ${m}m left`
  return `${m}m ${s}s left`
}

export function verticalLabel(vertical: string) {
  const map: Record<string, string> = {
    marketplace: 'Marketplace',
    eats: 'Eats',
    grocery: 'Grocery',
    pharmacy: 'Pharmacy',
    hotel: 'Stays',
    wholesale: 'Wholesale',
  }
  return map[vertical.toLowerCase()] ?? vertical
}
