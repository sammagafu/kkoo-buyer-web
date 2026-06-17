<template>
  <section class="table-booking" aria-label="Book a table">
    <header class="table-booking__head">
      <div>
        <h2 class="table-booking__title">Book a table</h2>
        <p class="table-booking__sub">{{ restaurantName }}</p>
      </div>
      <Icon icon="solar:chair-2-bold" class="table-booking__head-icon" aria-hidden="true" />
    </header>

    <div class="table-booking__fields">
      <label class="table-booking__field">
        <span>Guests</span>
        <input v-model.number="partySize" type="number" min="1" max="20" />
      </label>
      <label class="table-booking__field">
        <span>Date</span>
        <input v-model="date" type="date" />
      </label>
      <label class="table-booking__field">
        <span>Time</span>
        <input v-model="time" type="time" />
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
        {{ booking ? 'Booking…' : 'Reserve table' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { superAppApi } from '@/api/superApp'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'

const props = defineProps<{
  sellerUserId?: number | null
  restaurantName?: string
}>()

const auth = useAuthStore()
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

function defaultDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

const canSubmit = computed(() => Boolean(props.sellerUserId && date.value && time.value && partySize.value > 0))

function reservedAtIso(): string | null {
  if (!date.value || !time.value) return null
  const local = new Date(`${date.value}T${time.value}:00`)
  if (Number.isNaN(local.getTime())) return null
  return local.toISOString()
}

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
      ? `Table available for ${partySize.value} guests.`
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
    error.value = 'Sign in to book a table.'
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
