<template>
  <section class="send-delivery" aria-label="Delivery destination">
    <header class="send-delivery__head">
      <Icon icon="solar:map-point-bold" class="send-delivery__head-icon" aria-hidden="true" />
      <div>
        <h2 class="send-delivery__title">Deliver to</h2>
        <p class="send-delivery__hint">Pick a saved place or enter your address.</p>
      </div>
    </header>

    <div v-if="loadingAddresses" class="send-delivery__status">Loading saved places…</div>
    <div v-else-if="addresses.length" class="send-delivery__saved">
      <button
        v-for="addr in addresses"
        :key="String(addr.id)"
        type="button"
        class="send-delivery__saved-chip"
        :class="{ 'send-delivery__saved-chip--active': selectedAddressId === addr.id }"
        @click="selectAddress(addr)"
      >
        {{ addr.label }}
      </button>
      <button
        v-if="selectedAddressId != null"
        type="button"
        class="send-delivery__saved-clear"
        @click="clearSaved"
      >
        Use different address
      </button>
    </div>

    <div v-if="selectedAddressId == null || useManual" class="send-delivery__fields">
      <label class="send-form__field send-form__field--full">
        <span>Delivery address</span>
        <textarea
          :value="deliveryAddress"
          rows="2"
          placeholder="Street, area, city…"
          required
          @input="$emit('update:deliveryAddress', ($event.target as HTMLTextAreaElement).value)"
        />
      </label>
    </div>
    <div v-else class="send-delivery__summary">
      <p class="send-delivery__summary-title">{{ selectedLabel }}</p>
      <p class="send-delivery__summary-line">{{ deliveryAddress }}</p>
    </div>

    <label v-if="editPhone || !phone" class="send-form__field send-form__field--full">
      <span>Contact phone</span>
      <input
        :value="phone"
        type="tel"
        placeholder="712 345 678"
        required
        @input="$emit('update:phone', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <div v-else class="send-delivery__phone-row">
      <Icon icon="solar:phone-bold" aria-hidden="true" />
      <span>{{ phoneDisplay }}</span>
      <button type="button" class="send-delivery__phone-edit" @click="editPhone = true">Edit</button>
    </div>

    <label class="send-form__field send-form__field--full">
      <span>Delivery notes (optional)</span>
      <input
        :value="notes"
        type="text"
        placeholder="Gate code, landmark…"
        @input="$emit('update:notes', ($event.target as HTMLInputElement).value)"
      />
    </label>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { addressesApi } from '@/api/addresses'

type SavedAddress = {
  id?: number
  label?: string
  street?: string
  address_line1?: string
  formatted?: string
  city?: string
  district?: string
  phone_number?: string
  contact_phone?: string
  latitude?: number
  longitude?: number
  is_default?: boolean
}

const props = defineProps<{
  deliveryAddress: string
  phone: string
  notes: string
}>()

const emit = defineEmits<{
  'update:deliveryAddress': [value: string]
  'update:phone': [value: string]
  'update:notes': [value: string]
  coords: [lat: number | null, lng: number | null]
}>()

const addresses = ref<SavedAddress[]>([])
const loadingAddresses = ref(false)
const selectedAddressId = ref<number | null>(null)
const useManual = ref(false)
const editPhone = ref(false)

const selectedLabel = computed(() => {
  const addr = addresses.value.find((a) => a.id === selectedAddressId.value)
  return addr?.label || 'Saved address'
})

const phoneDisplay = computed(() => {
  const p = props.phone.trim()
  if (p.startsWith('+')) return p
  return p ? `+255 ${p.replace(/^0/, '')}` : ''
})

function formatLine(addr: SavedAddress) {
  return [addr.street ?? addr.address_line1 ?? addr.formatted, addr.city ?? addr.district]
    .filter((x) => x && String(x).trim())
    .join(', ')
}

function selectAddress(addr: SavedAddress) {
  selectedAddressId.value = addr.id ?? null
  useManual.value = false
  editPhone.value = false
  emit('update:deliveryAddress', formatLine(addr))
  const ph = addr.phone_number ?? addr.contact_phone
  if (ph) emit('update:phone', ph.replace(/^\+255/, ''))
  emit('coords', addr.latitude ?? null, addr.longitude ?? null)
}

function clearSaved() {
  selectedAddressId.value = null
  useManual.value = true
  editPhone.value = true
  emit('update:deliveryAddress', '')
  emit('coords', null, null)
}

async function loadAddresses() {
  loadingAddresses.value = true
  try {
    const { data } = await addressesApi.list()
    const list = (data?.results ?? []) as SavedAddress[]
    addresses.value = list.map((a) => ({
      ...a,
      label: a.label || a.city || 'Home',
    }))
    const def = list.find((a) => a.is_default) ?? list[0]
    if (def && !props.deliveryAddress) selectAddress(def)
    else if (!list.length) useManual.value = true
  } catch {
    useManual.value = true
  } finally {
    loadingAddresses.value = false
  }
}

watch(
  () => props.deliveryAddress,
  (val) => {
    if (!val.trim()) useManual.value = true
  },
)

onMounted(() => void loadAddresses())
</script>
