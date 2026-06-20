<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <button type="button" class="buyer-page-head__back" @click="router.push({ name: 'buyer.settings' })">
        <Icon icon="solar:arrow-left-linear" />
      </button>
      <h1 class="buyer-page-head__title">{{ t('buyerXp.settings.notifications') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.settings.notificationsSub') }}</p>
    </header>

    <section class="buyer-detail-card mb-3">
      <BuyerSectionHeader :title="t('buyerXp.settings.notificationPrefs')" />
      <p class="buyer-page-head__meta mb-3">{{ t('buyerXp.settings.notificationPrefsHint') }}</p>
      <label class="buyer-notify-pref">
        <span>
          <strong>{{ t('buyerXp.settings.saleEndingReminders') }}</strong>
          <span class="buyer-page-head__meta d-block">{{ t('buyerXp.settings.saleEndingRemindersSub') }}</span>
        </span>
        <input v-model="saleEndingEnabled" type="checkbox" :disabled="prefsSaving" @change="saveSaleEndingPref" />
      </label>
      <label class="buyer-notify-pref mt-2">
        <span>
          <strong>{{ t('buyerXp.settings.promotionsOffers') }}</strong>
          <span class="buyer-page-head__meta d-block">{{ t('buyerXp.settings.promotionsOffersSub') }}</span>
        </span>
        <input v-model="promotionsEnabled" type="checkbox" :disabled="prefsSaving" @change="savePromotionsPref" />
      </label>
      <p v-if="prefsError" class="buyer-xp-toast buyer-xp-toast--err mt-2">{{ prefsError }}</p>
    </section>

    <h2 class="buyer-section-label mb-2">Inbox</h2>

    <div v-if="unreadCount > 0" class="buyer-btn-row mb-3">
      <button
        type="button"
        class="buyer-venue__chip buyer-venue__chip--primary"
        :disabled="markingAll"
        @click="markAllRead"
      >
        {{ markingAll ? 'Updating…' : 'Mark all read' }}
      </button>
    </div>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else-if="items.length" class="buyer-hub-list">
      <article
        v-for="n in items"
        :key="n.id"
        class="buyer-detail-card buyer-notify-item"
        :class="{ 'buyer-notify-item--unread': !n.read_at }"
        @click="openNotification(n)"
      >
        <div class="buyer-notify-item__head">
          <span class="buyer-notify-item__icon" aria-hidden="true">
            <Icon icon="solar:bell-bing-broken" />
          </span>
          <div class="min-w-0 flex-grow-1">
            <div class="buyer-detail-row">
              <strong>{{ n.title || 'Notification' }}</strong>
              <span class="buyer-page-head__meta">{{ formatDate(n.created_at) }}</span>
            </div>
            <p v-if="n.message" class="buyer-page-head__meta mb-0">{{ n.message }}</p>
            <div v-if="n.data && (n.data.order_id || n.data.order_number)" class="mt-2">
              <a
                v-if="n.data.order_id && isPanelUser && orderLinkHref(n)"
                :href="orderLinkHref(n)"
                class="buyer-venue__chip"
                target="_blank"
                rel="noopener"
                @click.stop
              >
                View order
              </a>
              <router-link
                v-else-if="n.data.order_id && isPanelUser"
                :to="orderLinkRoute(n)"
                class="buyer-venue__chip"
                @click.stop
              >
                View order
              </router-link>
            </div>
          </div>
        </div>
      </article>
    </section>

    <BuyerEmptyState
      v-else
      icon="solar:bell-bold"
      title="No notifications yet"
      message="Alerts and updates from KKOO will appear here."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { notificationsApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { adminWebPath, bizWebPath } from '@/config/cross-app-links'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const loading = ref(true)
const error = ref('')
const items = ref<{ id: number; title?: string; message?: string; created_at?: string; read_at?: string | null; data?: Record<string, unknown> }[]>([])
const unreadCount = ref(0)
const markingAll = ref(false)
const saleEndingEnabled = ref(true)
const promotionsEnabled = ref(true)
const prefsSaving = ref(false)
const prefsError = ref('')
const promotionSubId = ref<number | null>(null)

const isPanelUser = computed(() => auth.isAdminOrStaff || auth.isSeller)

function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function orderLink(n: { data?: Record<string, unknown> }) {
  const rawId = n.data?.order_id
  const id = typeof rawId === 'string' || typeof rawId === 'number' ? rawId : undefined
  if (id !== undefined && auth.isSeller) return bizWebPath(`/seller/orders/${id}`)
  if (id !== undefined && auth.isAdminOrStaff) return adminWebPath(`/admin/orders/${id}`)
  return { name: 'buyer.settings' }
}

function orderLinkHref(n: { data?: Record<string, unknown> }) {
  const link = orderLink(n)
  return typeof link === 'string' ? link : ''
}

function orderLinkRoute(n: { data?: Record<string, unknown> }) {
  const link = orderLink(n)
  return typeof link === 'string' ? { name: 'buyer.settings' } : link
}

async function loadPreferences() {
  prefsError.value = ''
  try {
    const [settingsRes, prefsRes] = await Promise.all([
      notificationsApi.getSettings(),
      notificationsApi.getPreferences(),
    ])
    const settings = settingsRes.data?.results ?? []
    const saleSetting = settings.find((s) => s.notification_type === 'sale_ending')
    saleEndingEnabled.value = saleSetting ? saleSetting.enabled : true
    const subs = prefsRes.data?.results ?? []
    const promo = subs.find((s) => s.type === 'promotion' && s.is_active !== false)
    promotionsEnabled.value = Boolean(promo)
    promotionSubId.value = promo?.id ?? null
  } catch {
    saleEndingEnabled.value = true
    promotionsEnabled.value = true
  }
}

async function saveSaleEndingPref() {
  prefsSaving.value = true
  prefsError.value = ''
  try {
    await notificationsApi.patchSetting('sale_ending', saleEndingEnabled.value)
    if (saleEndingEnabled.value) {
      await notificationsApi.createPreference({ type: 'sale_ending' }).catch(() => undefined)
    } else {
      const { data } = await notificationsApi.getPreferences()
      const sub = (data?.results ?? []).find((s) => s.type === 'sale_ending')
      if (sub?.id) await notificationsApi.deletePreference(sub.id)
    }
  } catch (e: unknown) {
    const err = e as { response?: { data?: { error?: string } }; message?: string }
    prefsError.value = err.response?.data?.error ?? err.message ?? 'Could not save preference'
    saleEndingEnabled.value = !saleEndingEnabled.value
  } finally {
    prefsSaving.value = false
  }
}

async function savePromotionsPref() {
  prefsSaving.value = true
  prefsError.value = ''
  const prev = !promotionsEnabled.value
  try {
    if (promotionsEnabled.value) {
      const { data } = await notificationsApi.createPreference({ type: 'promotion' })
      promotionSubId.value = (data as { id?: number })?.id ?? promotionSubId.value
    } else if (promotionSubId.value) {
      await notificationsApi.deletePreference(promotionSubId.value)
      promotionSubId.value = null
    }
  } catch (e: unknown) {
    const err = e as { response?: { data?: { error?: string } }; message?: string }
    prefsError.value = err.response?.data?.error ?? err.message ?? 'Could not save preference'
    promotionsEnabled.value = prev
  } finally {
    prefsSaving.value = false
  }
}

async function openNotification(n: { id: number; read_at?: string | null; data?: Record<string, unknown> }) {
  if (!n.read_at) {
    try {
      await notificationsApi.markRead(n.id)
      n.read_at = new Date().toISOString()
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    } catch {
      // ignore
    }
  }
  const data = n.data ?? {}
  const flashSlug = data.flash_sale_slug ?? data.slug
  if (flashSlug) {
    void router.push({ name: 'buyer.flash-sale', params: { slug: String(flashSlug) } })
    return
  }
  const productId = data.product_id
  if (productId) {
    void router.push({ name: 'buyer.product', params: { id: String(productId) } })
  }
}

async function markAllRead() {
  markingAll.value = true
  try {
    await notificationsApi.markAllRead()
    items.value.forEach((n) => {
      n.read_at = n.read_at ?? new Date().toISOString()
    })
    unreadCount.value = 0
  } catch {
    error.value = 'Could not mark all as read'
  } finally {
    markingAll.value = false
  }
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    await loadPreferences()
    const [listRes, countRes] = await Promise.all([
      notificationsApi.list({ unread_only: false }),
      notificationsApi.getUnreadCount().catch(() => ({ data: { unread_count: 0 } })),
    ])
    const raw = listRes.data
    const list = Array.isArray(raw) ? raw : (raw as { results?: unknown[] })?.results ?? []
    items.value = list as typeof items.value
    unreadCount.value = (countRes.data?.unread_count ?? 0) as number
  } catch (e: unknown) {
    const err = e as { response?: { data?: { error?: string } }; message?: string }
    error.value = err.response?.data?.error ?? err.message ?? 'Failed to load notifications'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.buyer-notify-item {
  cursor: pointer;
}

.buyer-notify-item--unread {
  border-color: rgba(var(--bs-primary-rgb), 0.35);
}

.buyer-notify-item__head {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.buyer-notify-item__icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--buyer-chip-bg);
  color: var(--kkoo-primary);
  font-size: 1.15rem;
}

.buyer-notify-pref {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
}

.buyer-notify-pref input {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

.buyer-section-label {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--buyer-muted);
}
</style>
