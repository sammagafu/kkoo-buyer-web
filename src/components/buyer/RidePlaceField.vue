<template>
  <div class="ride-place-field">
    <label :for="id">{{ title }}</label>
    <input
      :id="id"
      v-model="query"
      type="text"
      :placeholder="placeholder"
      autocomplete="street-address"
      @input="onInput"
      @focus="showList = true"
      @blur="onBlur"
    />
    <ul v-if="showList && suggestions.length" class="ride-place-field__list">
      <li
        v-for="(s, i) in suggestions"
        :key="i"
        @mousedown.prevent="select(s)"
      >
        <span>{{ s.formatted }}</span>
        <small v-if="s.source === 'community'">Community</small>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { logisticsPublicApi } from '@/api/logistics'

const props = defineProps<{
  id: string
  title: string
  placeholder: string
  label: string
  lat: number | null
  lng: number | null
  mapPlaceId: number | null
}>()

const emit = defineEmits<{
  'update:label': [string]
  'update:lat': [number | null]
  'update:lng': [number | null]
  'update:mapPlaceId': [number | null]
}>()

const query = ref(props.label)
const suggestions = ref<Array<Record<string, unknown>>>([])
const showList = ref(false)
let debounce: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.label,
  (v) => {
    if (v !== query.value) query.value = v
  },
)

function onInput() {
  emit('update:label', query.value)
  emit('update:lat', null)
  emit('update:lng', null)
  emit('update:mapPlaceId', null)
  if (debounce) clearTimeout(debounce)
  const q = query.value.trim()
  if (q.length < 2) {
    suggestions.value = []
    return
  }
  debounce = setTimeout(async () => {
    try {
      const { data } = await logisticsPublicApi.searchPlaces(q)
      suggestions.value = Array.isArray(data) ? data : []
    } catch {
      suggestions.value = []
    }
  }, 300)
}

function select(s: Record<string, unknown>) {
  const formatted = String(s.formatted ?? '')
  const lat = typeof s.latitude === 'number' ? s.latitude : null
  const lng = typeof s.longitude === 'number' ? s.longitude : null
  const mapId = typeof s.id === 'number' ? s.id : null
  query.value = formatted
  emit('update:label', formatted)
  emit('update:lat', lat)
  emit('update:lng', lng)
  emit('update:mapPlaceId', s.source === 'community' ? mapId : null)
  suggestions.value = []
  showList.value = false
}

function onBlur() {
  setTimeout(() => {
    showList.value = false
  }, 200)
}
</script>

<style scoped>
.ride-place-field {
  position: relative;
  margin-bottom: 0.75rem;
}
.ride-place-field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.ride-place-field input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.ride-place-field__list {
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-height: 220px;
  overflow: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.ride-place-field__list li {
  padding: 0.65rem 0.75rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}
.ride-place-field__list li:hover {
  background: rgba(0, 0, 0, 0.04);
}
.ride-place-field__list small {
  color: #666;
}
</style>
