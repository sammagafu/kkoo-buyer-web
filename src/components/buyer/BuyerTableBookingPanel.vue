<template>
  <section class="table-booking" aria-label="Book a table">
    <header class="table-booking__head">
      <div>
        <h2 class="table-booking__title">Book a table</h2>
        <p class="table-booking__sub">{{ restaurantName }}</p>
      </div>
      <Icon icon="solar:chair-2-bold" class="table-booking__head-icon" aria-hidden="true" />
    </header>

    <div
      class="table-booking__progress"
      role="progressbar"
      :aria-valuenow="bookingProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Reservation progress"
    >
      <div class="table-booking__progress-bar" :style="{ width: `${bookingProgress}%` }" />
      <span class="table-booking__progress-label">{{ bookingProgress }}%</span>
    </div>

    <div class="table-booking__fields">
      <label class="table-booking__field">
        <span>Guests <em class="table-booking__rec">Recommended</em></span>
        <input v-model.number="partySize" type="number" min="1" max="20" />
      </label>
      <label class="table-booking__field">
        <span>Date</span>
        <input v-model="date" type="date" :min="minDate" />
      </label>
      <label class="table-booking__field">
        <span>Time <em class="table-booking__rec">Dinner</em></span>
        <select v-model="time">
          <option v-for="slot in timeSlots" :key="slot.value" :value="slot.value">
            {{ slot.label }}
          </option>
        </select>
      </label>
    </div>

    <label class="table-booking__field table-booking__field--full">
      <span>Notes (optional)</span>
      <input v-model.trim="notes" type="text" placeholder="Birthday, window seat, allergies…" />
    </label>

    <p v-if="availabilityMessage" class="table-booking__status" :class="availabilityOk ? 'table-booking__status--ok' : 'table-booking__status--warn'">
      {{ availabilityMessage }}
    </p>
    <p v-if="error" class="table-booking__status table-booking__status--err">{{ error }}</p>
    <p v-if="success" class="table-booking__status table-booking__status--ok">{{ success }}</p>

    <div class="table-booking__actions">
      <button type="button" class="table-booking__btn table-booking__btn--ghost" :disabled="checking || !canSubmit" @click="checkAvailability">
        {{ checking ? 'Checking…' : 'Check availability' }}
      </button>
      <button type="button" class="table-booking__btn" :disabled="booking || !canSubmit" @click="bookTable">
        {{ reserveCta }}
      </button>
    </div>

    <p v-if="!auth.isAuthenticated" class="table-booking__guest-hint">
      Pick guests, date, and time first — sign in only when you reserve so you don’t lose this table.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { superAppApi } from '@/api/superApp'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'

const props = defineProps<{
  sellerUserId?: number | null
  restaurantName?: string
}>()

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const partySize = ref(2)
const date = ref(defaultDate())
const time = ref('19:00')
const notes = ref('')
const checking = ref(false)
const booking = ref(false)
const availabilityMessage = ref('')
const availabilityOk = ref(false)
const error = ref('')
const success = ref('')

const timeSlots = [
  { value: '12:00', label: '12:00 · Lunch' },
  { value: '13:00', label: '13:00 · Lunch' },
  { value: '18:00', label: '18:00 · Early dinner' },
  { value: '19:00', label: '19:00 · Dinner (recommended)' },
  { value: '20:00', label: '20:00 · Dinner' },
  { value: '21:00', label: '21:00 · Late' },
]

function defaultDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

const minDate = computed(() => new Date().toISOString().slice(0, 10))

const canSubmit = computed(() => Boolean(props.sellerUserId && date.value && time.value && partySize.value > 0))

/** Goal gradient: defaults already fill party + dinner slot — never 0%. */
const bookingProgress = computed(() => {
  let pct = 25
  if (partySize.value > 0) pct = 40
  if (date.value) pct = Math.max(pct, 55)
  if (time.value) pct = Math.max(pct, 70)
  if (availabilityOk.value) pct = Math.max(pct, 85)
  if (success.value) pct = 100
  return pct
})

const reserveCta = computed(() => {
  if (booking.value) return 'Booking…'
  if (!auth.isAuthenticated) return 'Keep this table'
  if (availabilityOk.value) return 'Reserve table'
  return 'Reserve table'
})

function reservedAtIso(): string | null {
  if (!date.value || !time.value) return null
  const local = new Date(`${date.value}T${time.value}:00`)
  if (Number.isNaN(local.getTime())) return null
  return local.toISOString()
}

const DRAFT_KEY = 'kkoo_table_booking_draft'

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return
    const d = JSON.parse(raw) as {
      sellerUserId?: number
      partySize?: number
      date?: string
      time?: string
      notes?: string
    }
    if (d.sellerUserId && props.sellerUserId && d.sellerUserId !== props.sellerUserId) return
    if (d.partySize) partySize.value = d.partySize
    if (d.date) date.value = d.date
    if (d.time) time.value = d.time
    if (d.notes != null) notes.value = d.notes
  } catch {
    /* ignore */
  }
}

function saveDraft() {
  try {
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        sellerUserId: props.sellerUserId,
        partySize: partySize.value,
        date: date.value,
        time: time.value,
        notes: notes.value,
      }),
    )
  } catch {
    /* ignore */
  }
}

loadDraft()

watch([partySize, date, time, notes], saveDraft)

watch(
  () => [props.sellerUserId, date.value, time.value, partySize.value],
  () => {
    availabilityMessage.value = ''
    availabilityOk.value = false
    error.value = ''
    success.value = ''
  },
)

async function checkAvailability() {
  error.value = ''
  success.value = ''
  const at = reservedAtIso()
  if (!props.sellerUserId || !at) {
    error.value = 'Pick a date and time.'
    return
  }
  checking.value = true
  try {
    const { data } = await superAppApi.checkTableAvailability({
      seller_user_id: props.sellerUserId,
      reserved_at: at,
      party_size: partySize.value,
    })
    availabilityOk.value = Boolean(data?.available)
    availabilityMessage.value = data?.available
      ? `Table available for ${partySize.value} guests — hold it before someone else does.`
      : (data?.reason as string) || 'Not available for this time.'
  } catch (e) {
    error.value = formatApiError(e, 'Could not check availability')
  } finally {
    checking.value = false
  }
}

async function bookTable() {
  error.value = ''
  success.value = ''
  if (!auth.isAuthenticated) {
    // IKEA + loss aversion: let them customize first, then soft gate
    await router.push({
      name: 'auth.sign-in',
      query: { redirectedFrom: route.fullPath },
    })
    return
  }
  const at = reservedAtIso()
  if (!props.sellerUserId || !at) {
    error.value = 'Pick a date and time.'
    return
  }
  booking.value = true
  try {
    const { data } = await superAppApi.createTableReservation({
      seller_user_id: props.sellerUserId,
      reserved_at: at,
      party_size: partySize.value,
      notes: notes.value,
    })
    success.value = `Table reserved${data?.id ? ` (#${data.id})` : ''}. Add food below or pay deposit in orders.`
    availabilityOk.value = true
    availabilityMessage.value = 'Reservation confirmed.'
  } catch (e) {
    error.value = formatApiError(e, 'Could not book table')
  } finally {
    booking.value = false
  }
}
</script>
