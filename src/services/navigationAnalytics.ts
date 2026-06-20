import client from '@/api/client'
import { useAuthStore } from '@/stores/auth'

const SESSION_KEY = 'kkoo_analytics_session_id'
const SESSION_STARTED_KEY = 'kkoo_analytics_session_started_ms'

function devicePlatform(): string {
  return 'web'
}

function ensureSession(): string {
  if (typeof sessionStorage === 'undefined') return `web-${Date.now()}`
  const existing = sessionStorage.getItem(SESSION_KEY)
  const started = Number(sessionStorage.getItem(SESSION_STARTED_KEY) ?? 0)
  const age = Date.now() - started
  if (existing && started > 0 && age < 12 * 60 * 60 * 1000) {
    return existing
  }
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  sessionStorage.setItem(SESSION_KEY, id)
  sessionStorage.setItem(SESSION_STARTED_KEY, String(Date.now()))
  return id
}

export function resolveRoute(name?: string | null): { surface: string; vertical: string } {
  const n = (name ?? '').trim()
  if (!n) return { surface: 'unknown', vertical: 'unknown' }
  if (n === 'buyer.marketplace' || n === 'buyer.market') {
    return { surface: 'home', vertical: 'retail' }
  }
  if (n === 'buyer.search') return { surface: 'search', vertical: 'retail' }
  if (n === 'buyer.cart') return { surface: 'cart', vertical: 'retail' }
  if (n === 'buyer.checkout') return { surface: 'checkout', vertical: 'retail' }
  if (n === 'buyer.eats') return { surface: 'store', vertical: 'food' }
  if (n === 'buyer.grocery') return { surface: 'store', vertical: 'retail' }
  if (n === 'buyer.pharmacy' || n.startsWith('buyer.pharmacy.')) {
    return { surface: 'pharmacy', vertical: 'retail' }
  }
  if (n === 'buyer.product') return { surface: 'product', vertical: 'retail' }
  if (n.startsWith('buyer.order')) return { surface: 'orders', vertical: 'retail' }
  if (n === 'auth.sign-in' || n === 'auth.sign-up') {
    return { surface: 'auth', vertical: 'unknown' }
  }
  if (n.includes('ride')) return { surface: 'ride', vertical: 'logistics' }
  if (n.includes('reward') || n.includes('flash')) {
    return { surface: 'rewards', vertical: 'retail' }
  }
  return { surface: n.replace(/^buyer\./, ''), vertical: 'retail' }
}

let currentSurface: string | null = null
let currentVertical: string | null = null

async function postEvent(body: Record<string, unknown>) {
  try {
    await client.post('/analytics/events/track/', body)
  } catch {
    // Best-effort; do not block navigation.
  }
}

async function track(
  eventName: 'screen_view' | 'screen_exit',
  surface: string,
  vertical: string,
  routeName?: string,
) {
  const auth = useAuthStore()
  await postEvent({
    event_name: eventName,
    actor_type: auth.isAuthenticated ? 'buyer' : 'guest',
    vertical,
    surface,
    session_id: ensureSession(),
    device_platform: devicePlatform(),
    locale: typeof navigator !== 'undefined' ? navigator.language : 'en',
    ...(routeName ? { route: routeName } : {}),
  })
}

export async function trackScreenView(routeName?: string | null) {
  const { surface, vertical } = resolveRoute(routeName)
  if (currentSurface === surface && currentVertical === vertical) return
  if (currentSurface != null) {
    await track('screen_exit', currentSurface, currentVertical ?? 'unknown')
  }
  currentSurface = surface
  currentVertical = vertical
  await track('screen_view', surface, vertical, routeName ?? undefined)
}

export function trackScreenExitOnUnload() {
  if (currentSurface == null) return
  const surface = currentSurface
  const vertical = currentVertical ?? 'unknown'
  const auth = useAuthStore()
  const body = JSON.stringify({
    event_name: 'screen_exit',
    actor_type: auth.isAuthenticated ? 'buyer' : 'guest',
    vertical,
    surface,
    session_id: ensureSession(),
    device_platform: devicePlatform(),
  })
  const base = client.defaults.baseURL ?? '/api/v1'
  const url = `${base.replace(/\/$/, '')}/analytics/events/track/`
  const token = auth.accessToken
  if (typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' })
    navigator.sendBeacon(url, blob)
    return
  }
  void postEvent(JSON.parse(body) as Record<string, unknown>)
}

export function initNavigationAnalytics(router: {
  afterEach: (cb: (to: { name?: string | symbol | null }) => void) => void
}) {
  router.afterEach((to) => {
    const name = typeof to.name === 'string' ? to.name : null
    void trackScreenView(name)
  })
  if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', trackScreenExitOnUnload)
  }
}
