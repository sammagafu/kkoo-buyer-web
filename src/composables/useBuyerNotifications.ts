import { ref } from 'vue'
import { notificationsApi } from '@/api/notifications'
import { campaignCtaRoute } from '@/composables/useBuyerCampaigns'

export type BuyerNotification = {
  id: number
  title?: string
  message?: string
  created_at?: string
  read_at?: string | null
  data?: Record<string, unknown>
}

const items = ref<BuyerNotification[]>([])
const unreadCount = ref(0)
const loading = ref(false)
const markingAll = ref(false)

function formatRelativeDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function notificationLink(n: BuyerNotification) {
  const data = n.data ?? {}
  const ctaRoute = data.cta_route
  if (typeof ctaRoute === 'string' && ctaRoute.trim()) {
    const mapped = campaignCtaRoute({ cta_route: ctaRoute } as import('@/api/campaigns').BuyerCampaign)
    if (mapped) return mapped
  }
  const rawId = data.order_id
  const id = typeof rawId === 'string' || typeof rawId === 'number' ? rawId : undefined
  if (id !== undefined) return { name: 'buyer.orders' as const, query: { order: String(id) } }
  return { name: 'account.notifications' as const }
}

export function useBuyerNotifications() {
  async function loadUnreadCount() {
    try {
      const { data } = await notificationsApi.getUnreadCount()
      unreadCount.value = data?.unread_count ?? 0
    } catch {
      unreadCount.value = 0
    }
  }

  async function loadNotifications(unreadOnly = true) {
    loading.value = true
    try {
      const [listRes, countRes] = await Promise.all([
        notificationsApi.list({ unread_only: unreadOnly }),
        notificationsApi.getUnreadCount(),
      ])
      const raw = listRes.data
      const list = Array.isArray(raw) ? raw : (raw as { results?: BuyerNotification[] })?.results ?? []
      items.value = list as BuyerNotification[]
      unreadCount.value = countRes.data?.unread_count ?? 0
    } catch {
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function markRead(n: BuyerNotification) {
    if (n.read_at) return
    try {
      await notificationsApi.markRead(n.id)
      n.read_at = new Date().toISOString()
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    } catch {
      // ignore
    }
  }

  async function markAllRead() {
    markingAll.value = true
    try {
      await notificationsApi.markAllRead()
      items.value.forEach((n) => {
        n.read_at = n.read_at || new Date().toISOString()
      })
      unreadCount.value = 0
    } catch {
      // ignore
    } finally {
      markingAll.value = false
    }
  }

  return {
    items,
    unreadCount,
    loading,
    markingAll,
    loadUnreadCount,
    loadNotifications,
    markRead,
    markAllRead,
    formatRelativeDate,
  }
}
