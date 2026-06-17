<template>
  <MarketingLayout>
    <section class="lp-section discover-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="discover-hero-grid">
          <div>
            <p class="discover-eyebrow">{{ t('discover.eyebrow') }}</p>
            <h1 class="discover-title">
              {{ t('discover.heroTitle') }}
              <span>{{ t('discover.heroAccent') }}</span>
            </h1>
            <p class="discover-lead">{{ t('discover.heroLead') }}</p>
          </div>
          <article class="discover-hero-card">
            <Icon icon="solar:ticket-bold" class="discover-hero-icon" aria-hidden="true" />
            <p class="mb-1 fw-semibold">{{ t('discover.heroCardTitle') }}</p>
            <p class="small text-muted mb-0">{{ t('discover.heroCardCopy') }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section discover-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="discover-toolbar">
          <div class="discover-filters">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="discover-filter"
              :class="{ 'discover-filter--active': activeCategory === cat.id }"
              @click="activeCategory = cat.id; loadEvents()"
            >
              {{ cat.label }}
            </button>
          </div>
          <p v-if="loading" class="discover-note mb-0">{{ t('discover.loading') }}</p>
          <p v-else-if="error" class="discover-note discover-note--error mb-0">{{ error }}</p>
          <p v-else class="discover-note mb-0">{{ t('discover.available', { count: events.length }) }}</p>
        </div>

        <div class="discover-grid">
          <article
            v-for="event in events"
            :key="event.uuid || event.id"
            class="discover-card"
            :class="{ 'discover-card--active': selectedEvent?.id === event.id }"
            @click="openEvent(event)"
          >
            <div class="discover-card-top">
              <span class="discover-card-tag">{{ categoryLabel(event.category) }}</span>
              <span v-if="event.is_featured" class="discover-card-tag discover-card-tag--featured">{{ t('discover.featured') }}</span>
            </div>
            <h3>{{ event.title }}</h3>
            <p class="discover-card-copy">{{ event.summary || event.description }}</p>
            <div class="discover-card-meta">
              <span><Icon icon="solar:calendar-bold" /> {{ formatDate(event.starts_at) }}</span>
              <span v-if="event.venue_name"><Icon icon="solar:map-point-bold" /> {{ event.venue_name }}</span>
            </div>
          </article>
        </div>

        <p v-if="!loading && !error && events.length === 0" class="discover-empty">{{ t('discover.empty') }}</p>
      </b-container>
    </section>

    <section v-if="selectedEvent" class="lp-section discover-detail">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="discover-detail-grid">
          <div>
            <p class="discover-detail-kicker">{{ categoryLabel(selectedEvent.category) }}</p>
            <h2 class="discover-detail-title">{{ selectedEvent.title }}</h2>
            <p class="discover-detail-copy">{{ selectedEvent.description || selectedEvent.summary }}</p>
            <ul class="discover-detail-facts">
              <li><strong>{{ t('discover.when') }}</strong> {{ formatDateTime(selectedEvent.starts_at) }}</li>
              <li v-if="selectedEvent.venue_name"><strong>{{ t('discover.where') }}</strong> {{ selectedEvent.venue_name }}, {{ selectedEvent.city }}</li>
              <li v-if="selectedEvent.organizer_name"><strong>{{ t('discover.organizer') }}</strong> {{ selectedEvent.organizer_name }}</li>
            </ul>
          </div>

          <div class="discover-tickets">
            <h3 class="discover-tickets-title">{{ t('discover.chooseTicket') }}</h3>
            <p v-if="detailLoading" class="small text-muted">{{ t('discover.loadingTickets') }}</p>
            <article
              v-for="ticketClass in ticketClasses"
              :key="ticketClass.id"
              class="discover-ticket-card"
              :class="{ 'discover-ticket-card--active': selectedClassId === ticketClass.id, 'discover-ticket-card--disabled': !ticketClass.on_sale }"
              @click="ticketClass.on_sale && (selectedClassId = ticketClass.id)"
            >
              <div class="discover-ticket-head">
                <h4>{{ ticketClass.name }}</h4>
                <strong>{{ formatPrice(ticketClass.price, ticketClass.currency) }}</strong>
              </div>
              <p v-if="ticketClass.description" class="small text-muted mb-2">{{ ticketClass.description }}</p>
              <ul v-if="ticketClass.benefits?.length" class="discover-benefits">
                <li v-for="benefit in ticketClass.benefits" :key="benefit">
                  <Icon icon="solar:check-circle-bold" />
                  <span>{{ benefit }}</span>
                </li>
              </ul>
              <p class="discover-ticket-meta small mb-0">
                <span v-if="ticketClass.on_sale">{{ t('discover.remaining', { count: ticketClass.remaining }) }}</span>
                <span v-else>{{ t('discover.soldOut') }}</span>
              </p>
            </article>

            <div v-if="selectedClass" class="discover-checkout">
              <label class="small fw-semibold">{{ t('discover.quantity') }}</label>
              <b-form-input v-model.number="quantity" type="number" min="1" max="10" class="mb-3" />
              <label class="small fw-semibold">{{ t('discover.attendeeName') }}</label>
              <b-form-input v-model="attendeeName" class="mb-3" />
              <KkooAccountButton
                v-if="!isAuthenticated"
                variant="primary"
                size="sm"
                :redirect-from="`/discover`"
                force-sign-in
                block
              />
              <b-button
                v-else
                variant="primary"
                class="w-100"
                :disabled="purchasing || !selectedClass.on_sale"
                @click="purchaseTickets"
              >
                {{ purchasing ? t('discover.purchasing') : t('discover.buyTickets') }}
              </b-button>
              <p v-if="purchaseMessage" class="small text-success mt-2 mb-0">{{ purchaseMessage }}</p>
              <p v-if="purchaseError" class="small text-danger mt-2 mb-0">{{ purchaseError }}</p>
            </div>
          </div>
        </div>
      </b-container>
    </section>

    <section v-if="isAuthenticated && myTickets.length" class="lp-section discover-mine">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <h2 class="discover-mine-title">{{ t('discover.myTickets') }}</h2>
        <div class="discover-mine-grid">
          <article v-for="ticket in myTickets" :key="ticket.uuid" class="discover-mine-card">
            <p class="discover-mine-code">{{ ticket.ticket_code }}</p>
            <h3>{{ ticket.event?.title }}</h3>
            <p class="small text-muted mb-1">{{ ticket.ticket_class?.name }} · {{ ticket.quantity }}×</p>
            <p class="small mb-0">
              <span :class="ticket.payment_status === 'paid' ? 'text-success' : 'text-warning'">
                {{ ticket.payment_status === 'paid' ? t('discover.paid') : t('discover.pendingPayment') }}
              </span>
            </p>
          </article>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import KkooAccountButton from '@/components/auth/KkooAccountButton.vue'
import { eventsApi, type EventTicketClass, type MyTicketRow, type PlatformEvent } from '@/api/events'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'

const { t } = useI18n()
const auth = useAuthStore()

const loading = ref(false)
const detailLoading = ref(false)
const purchasing = ref(false)
const error = ref('')
const purchaseError = ref('')
const purchaseMessage = ref('')
const events = ref<PlatformEvent[]>([])
const selectedEvent = ref<PlatformEvent | null>(null)
const ticketClasses = ref<EventTicketClass[]>([])
const selectedClassId = ref<number | null>(null)
const quantity = ref(1)
const attendeeName = ref('')
const myTickets = ref<MyTicketRow[]>([])
const activeCategory = ref('all')

const isAuthenticated = computed(() => auth.isAuthenticated)
const selectedClass = computed(() => ticketClasses.value.find((tc) => tc.id === selectedClassId.value) ?? null)

const categories = computed(() => [
  { id: 'all', label: t('discover.categories.all') },
  { id: 'music', label: t('discover.categories.music') },
  { id: 'sports', label: t('discover.categories.sports') },
  { id: 'food', label: t('discover.categories.food') },
  { id: 'business', label: t('discover.categories.business') },
  { id: 'arts', label: t('discover.categories.arts') },
  { id: 'community', label: t('discover.categories.community') },
])

function categoryLabel(cat?: string) {
  const key = cat && cat !== 'all' ? cat : 'community'
  return t(`discover.categories.${key}`, key)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

function formatPrice(amount: number, currency = 'TZS') {
  return `${currency} ${Math.round(amount).toLocaleString()}`
}

async function loadEvents() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await eventsApi.list({
      category: activeCategory.value === 'all' ? undefined : activeCategory.value,
    })
    events.value = data.results ?? []
  } catch (e) {
    error.value = formatApiError(e, t('discover.loadFailed'))
  } finally {
    loading.value = false
  }
}

async function openEvent(event: PlatformEvent) {
  selectedEvent.value = event
  selectedClassId.value = null
  purchaseError.value = ''
  purchaseMessage.value = ''
  detailLoading.value = true
  try {
    const ref = event.slug || event.uuid || String(event.id)
    const { data } = await eventsApi.get(ref)
    selectedEvent.value = data
    ticketClasses.value = data.ticket_classes ?? []
    const firstOnSale = ticketClasses.value.find((tc) => tc.on_sale)
    selectedClassId.value = firstOnSale?.id ?? null
  } catch (e) {
    purchaseError.value = formatApiError(e, t('discover.loadFailed'))
  } finally {
    detailLoading.value = false
  }
}

async function loadMyTickets() {
  if (!isAuthenticated.value) return
  try {
    const { data } = await eventsApi.myTickets()
    myTickets.value = data.results ?? []
  } catch {
    myTickets.value = []
  }
}

async function purchaseTickets() {
  if (!selectedEvent.value || !selectedClassId.value) return
  purchasing.value = true
  purchaseError.value = ''
  purchaseMessage.value = ''
  try {
    const ref = selectedEvent.value.slug || selectedEvent.value.uuid || String(selectedEvent.value.id)
    const { data: purchase } = await eventsApi.purchase(ref, {
      ticket_class_id: selectedClassId.value,
      quantity: quantity.value,
      attendee_name: attendeeName.value.trim() || undefined,
    })
    const redirect = `${window.location.origin}/discover?paid=1`
    const cancel = `${window.location.origin}/discover?cancelled=1`
    const { data: payment } = await eventsApi.initiatePayment({
      event_ticket_purchase_id: purchase.purchase_id,
      amount: purchase.total_amount,
      redirect_url: redirect,
      cancel_url: cancel,
    })
    if (payment.payment_gateway_url) {
      window.location.href = payment.payment_gateway_url
      return
    }
    purchaseMessage.value = t('discover.purchaseCreated', { code: purchase.ticket_code })
    await loadMyTickets()
    await openEvent(selectedEvent.value)
  } catch (e) {
    purchaseError.value = formatApiError(e, t('discover.purchaseFailed'))
  } finally {
    purchasing.value = false
  }
}

onMounted(async () => {
  await loadEvents()
  await loadMyTickets()
})
</script>

<style scoped>
.discover-hero {
  background:
    radial-gradient(circle at 12% 20%, rgba(247, 168, 41, 0.16), transparent 34%),
    radial-gradient(circle at 88% 10%, rgba(92, 48, 143, 0.14), transparent 30%);
}
.discover-hero-grid {
  display: grid;
  gap: 1.5rem;
  align-items: center;
}
@media (min-width: 992px) {
  .discover-hero-grid { grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.7fr); }
}
.discover-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: var(--kkoo-primary);
}
.discover-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.05;
  color: var(--buyer-ink);
}
.discover-title span { color: var(--kkoo-primary); }
.discover-lead { color: var(--buyer-muted); max-width: 42rem; }
.discover-hero-card {
  border-radius: 1.25rem;
  padding: 1.25rem;
  background: var(--buyer-surface);
  border: 1px solid var(--buyer-border);
  box-shadow: 0 18px 40px var(--buyer-shadow-color);
}
.discover-hero-icon { width: 2rem; height: 2rem; color: #f7a829; margin-bottom: 0.5rem; }
.discover-toolbar { display: grid; gap: 1rem; margin-bottom: 1.25rem; }
.discover-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.discover-filter {
  border: 1px solid var(--buyer-border-strong);
  background: var(--buyer-surface);
  color: var(--buyer-ink);
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.88rem;
  font-weight: 600;
}
.discover-filter--active { background: var(--kkoo-primary); color: #fff; border-color: var(--kkoo-primary); }
.discover-note { font-size: 0.92rem; color: var(--buyer-muted); }
.discover-note--error { color: #b42318; }
.discover-grid { display: grid; gap: 0.85rem; }
@media (min-width: 768px) { .discover-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1200px) { .discover-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.discover-card {
  border: 1px solid var(--buyer-border);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--buyer-surface);
  color: var(--buyer-ink);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.discover-card:hover, .discover-card--active {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px var(--buyer-shadow-color);
  border-color: var(--buyer-border-strong);
}
.discover-card-top { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.discover-card-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--kkoo-primary);
  background: var(--buyer-chip-bg);
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
}
.discover-card-tag--featured { color: #f7a829; background: rgba(247, 168, 41, 0.16); }
.discover-card h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.35rem; }
.discover-card-copy { font-size: 0.92rem; color: var(--buyer-muted); margin-bottom: 0.75rem; }
.discover-card-meta { display: grid; gap: 0.25rem; font-size: 0.82rem; color: var(--buyer-muted); }
.discover-card-meta span { display: inline-flex; align-items: center; gap: 0.35rem; }
.discover-empty { text-align: center; color: var(--buyer-muted); padding: 2rem 0; }
.discover-detail-grid {
  display: grid;
  gap: 1.5rem;
  align-items: start;
}
@media (min-width: 992px) { .discover-detail-grid { grid-template-columns: minmax(0, 1fr) minmax(320px, 0.9fr); } }
.discover-detail-kicker {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--kkoo-primary);
}
.discover-detail-title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; margin-bottom: 0.75rem; color: var(--buyer-ink); }
.discover-detail-copy { color: var(--buyer-muted); }
.discover-detail-facts { padding-left: 1rem; margin: 1rem 0 0; display: grid; gap: 0.35rem; color: var(--buyer-muted); }
.discover-tickets-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--buyer-ink); }
.discover-ticket-card {
  border: 1px solid var(--buyer-border);
  border-radius: 1rem;
  padding: 0.9rem;
  background: var(--buyer-surface);
  color: var(--buyer-ink);
  margin-bottom: 0.65rem;
  cursor: pointer;
}
.discover-ticket-card--active { border-color: var(--kkoo-primary); box-shadow: 0 0 0 2px color-mix(in srgb, var(--kkoo-primary) 20%, transparent); }
.discover-ticket-card--disabled { opacity: 0.55; cursor: not-allowed; }
.discover-ticket-head { display: flex; justify-content: space-between; gap: 0.75rem; align-items: baseline; margin-bottom: 0.35rem; }
.discover-ticket-head h4 { font-size: 1rem; font-weight: 800; margin: 0; }
.discover-benefits { list-style: none; padding: 0; margin: 0 0 0.5rem; display: grid; gap: 0.35rem; }
.discover-benefits li { display: flex; gap: 0.4rem; align-items: flex-start; font-size: 0.88rem; }
.discover-benefits :deep(svg) { width: 1rem; height: 1rem; color: #059669; flex-shrink: 0; margin-top: 0.1rem; }
.discover-checkout {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--buyer-border);
}
.discover-mine-title { font-size: 1.35rem; font-weight: 800; margin-bottom: 1rem; color: var(--buyer-ink); }
.discover-mine-grid { display: grid; gap: 0.75rem; }
@media (min-width: 768px) { .discover-mine-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.discover-mine-card {
  border-radius: 1rem;
  border: 1px dashed var(--buyer-border-strong);
  padding: 1rem;
  background: var(--buyer-surface);
  color: var(--buyer-ink);
}
.discover-mine-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 800;
  color: var(--kkoo-primary);
  margin-bottom: 0.35rem;
}
</style>
