<template>
  <div class="ride-place-field">
    <label :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      v-model="query"
      type="search"
      autocomplete="off"
      :placeholder="placeholder"
      @focus="open = true"
      @input="onInput"
    />
    <ul v-if="open && suggestions.length" class="ride-place-field__list">
      <li v-for="(s, i) in suggestions" :key="`${s.formatted}-${i}`">
        <button type="button" @click="pick(s)">
          <span>{{ s.formatted }}</span>
          <small v-if="s.source === 'community'">Community</small>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { logisticsPublicApi } from '@/api/logistics'

export type RidePlace = {
  formatted: string
  latitude: number
  longitude: number
  id?: number
  source?: string
}

const props = defineProps<{
  label: string
  placeholder: string
  inputId: string
  modelValue: RidePlace | null
}>()

const emit = defineEmits<{
  'update:modelValue': [RidePlace | null]
}>()

const query = ref(props.modelValue?.formatted ?? '')
const suggestions = ref<RidePlace[]>([])
const open = ref(false)
let debounce: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.modelValue,
  (v) => {
    if (v?.formatted && v.formatted !== query.value) query.value = v.formatted
  },
)

function onInput() {
  emit('update:modelValue', null)
  if (debounce) clearTimeout(debounce)
  const q = query.value.trim()
  if (q.length < 2) {
    suggestions.value = []
    return
  }
  debounce = setTimeout(async () => {
    try {
      const { data } = await logisticsPublicApi.searchPlaces(q)
      const rows = Array.isArray(data) ? data : []
      suggestions.value = rows
        .map((r) => {
          const lat = Number(r.latitude)
          const lng = Number(r.longitude)
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
          return {
            formatted: String(r.formatted ?? ''),
            latitude: lat,
            longitude: lng,
            id: typeof r.id === 'number' ? r.id : undefined,
            source: (r as { source?: string }).source,
          } satisfies RidePlace
        })
        .filter(Boolean) as RidePlace[]
      open.value = true
    } catch {
      suggestions.value = []
    }
  }, 280)
}

function pick(place: RidePlace) {
  query.value = place.formatted
  suggestions.value = []
  open.value = false
  emit('update:modelValue', place)
}
</script>

<style scoped>
.ride-place-field {
  position: relative;
}
.ride-place-field label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.ride-place-field input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(92, 48, 143, 0.18);
}
.ride-place-field__list {
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
  background: #fff;
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(35, 20, 46, 0.12);
  max-height: 220px;
  overflow: auto;
}
.ride-place-field__list button {
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 0.65rem 0.85rem;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}
.ride-place-field__list button:hover {
  background: rgba(92, 48, 143, 0.06);
}
.ride-place-field__list small {
  color: #5c3090;
  font-weight: 600;
}
</style>
