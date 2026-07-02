<template>
  <div class="buyer-ride-field ride-place-field">
    <label class="buyer-ride-field__label" :for="id">
      <span
        v-if="marker"
        class="buyer-ride-field__dot"
        :class="`buyer-ride-field__dot--${marker}`"
        aria-hidden="true"
      />
      {{ title }}
    </label>
    <input
      :id="id"
      v-model="query"
      class="buyer-ride-field__input"
      type="text"
      :placeholder="placeholder"
      autocomplete="street-address"
      @input="onInput"
      @focus="showList = true"
      @blur="onBlur"
    />
    <p v-if="searchError" class="buyer-ride-field__hint buyer-ride-field__hint--warn">{{ searchError }}</p>
    <ul v-if="showList && suggestions.length" class="ride-place-field__list" role="listbox">
      <li
        v-for="(s, i) in suggestions"
        :key="`${s.formatted}-${i}`"
        role="option"
        @mousedown.prevent="select(s)"
      >
        <span>{{ s.formatted }}</span>
        <small v-if="s.source === 'community'">Community</small>
        <small v-else-if="s.source === 'fallback'">Offline</small>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { logisticsPublicApi } from '@/api/logistics'
import { filterDsmPlaceFallbacks } from '@/constants/dsmPlaces'

type PlaceSuggestion = {
  formatted: string
  latitude: number | null
  longitude: number | null
  id?: number
  source?: string
}

const props = defineProps<{
  id: string
  title: string
  placeholder: string
  label: string
  lat: number | null
  lng: number | null
  mapPlaceId: number | null
  marker?: 'pickup' | 'dropoff'
}>()

const emit = defineEmits<{
  'update:label': [string]
  'update:lat': [number | null]
  'update:lng': [number | null]
  'update:mapPlaceId': [number | null]
}>()

const { t } = useI18n()
const query = ref(props.label)
const suggestions = ref<PlaceSuggestion[]>([])
const showList = ref(false)
const searchError = ref('')
let debounce: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.label,
  (v) => {
    if (v !== query.value) query.value = v
  },
)

function parseCoord(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function normalizeRow(row: Record<string, unknown>): PlaceSuggestion | null {
  const lat = parseCoord(row.latitude)
  const lng = parseCoord(row.longitude)
  const formatted = String(row.formatted ?? '').trim()
  if (!formatted || lat == null || lng == null) return null
  return {
    formatted,
    latitude: lat,
    longitude: lng,
    id: typeof row.id === 'number' ? row.id : undefined,
    source: typeof row.source === 'string' ? row.source : undefined,
  }
}

function mergeSuggestions(apiRows: PlaceSuggestion[], q: string) {
  const seen = new Set(apiRows.map((r) => r.formatted.toLowerCase()))
  const fallbacks = filterDsmPlaceFallbacks(q)
    .filter((p) => !seen.has(p.formatted.toLowerCase()))
    .map((p) => ({
      formatted: p.formatted,
      latitude: p.latitude,
      longitude: p.longitude,
      source: p.source,
    }))
  return [...apiRows, ...fallbacks].slice(0, 10)
}

async function fetchSuggestions(q: string) {
  const trimmed = q.trim()
  if (trimmed.length < 2) {
    suggestions.value = []
    searchError.value = ''
    return
  }
  try {
    const { data } = await logisticsPublicApi.searchPlaces(trimmed)
    if (data && !Array.isArray(data) && typeof data === 'object' && 'error' in data) {
      suggestions.value = mergeSuggestions([], trimmed)
      searchError.value =
        suggestions.value.length > 0
          ? t('buyerXp.ride.placeSearchOffline')
          : t('buyerXp.ride.placeSearchFailed')
      showList.value = suggestions.value.length > 0
      return
    }
    const rows = (Array.isArray(data) ? data : [])
      .map((row) => normalizeRow(row as Record<string, unknown>))
      .filter(Boolean) as PlaceSuggestion[]
    suggestions.value = mergeSuggestions(rows, trimmed)
    searchError.value = rows.length === 0 && suggestions.value.length > 0 ? t('buyerXp.ride.placeSearchOffline') : ''
    showList.value = suggestions.value.length > 0
  } catch {
    suggestions.value = mergeSuggestions([], trimmed)
    searchError.value =
      suggestions.value.length > 0
        ? t('buyerXp.ride.placeSearchOffline')
        : t('buyerXp.ride.placeSearchFailed')
    showList.value = suggestions.value.length > 0
  }
}

function onInput() {
  emit('update:label', query.value)
  emit('update:lat', null)
  emit('update:lng', null)
  emit('update:mapPlaceId', null)
  searchError.value = ''
  if (debounce) clearTimeout(debounce)
  const q = query.value.trim()
  if (q.length < 2) {
    suggestions.value = []
    return
  }
  debounce = setTimeout(() => {
    void fetchSuggestions(q)
  }, 300)
}

function select(s: PlaceSuggestion) {
  const lat = s.latitude
  const lng = s.longitude
  if (lat == null || lng == null) return
  query.value = s.formatted
  emit('update:label', s.formatted)
  emit('update:lat', lat)
  emit('update:lng', lng)
  emit('update:mapPlaceId', s.source === 'community' && typeof s.id === 'number' ? s.id : null)
  suggestions.value = []
  showList.value = false
  searchError.value = ''
}

async function resolveOnBlur() {
  if (props.lat != null && props.lng != null) return
  const q = query.value.trim()
  if (q.length < 2) return
  await fetchSuggestions(q)
  const normalized = q.toLowerCase()
  const exact = suggestions.value.find((s) => s.formatted.toLowerCase() === normalized)
  if (exact) {
    select(exact)
    return
  }
  if (suggestions.value.length === 1) {
    select(suggestions.value[0]!)
    return
  }
  const partial = suggestions.value.find((s) => {
    const label = s.formatted.toLowerCase()
    const head = label.split(',')[0]?.trim() ?? label
    return label.includes(normalized) || normalized.includes(head)
  })
  if (partial) select(partial)
}

function onBlur() {
  setTimeout(() => {
    showList.value = false
    void resolveOnBlur()
  }, 200)
}
</script>
