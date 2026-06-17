<template>
  <div class="buyer-hotels-map" :class="{ 'buyer-hotels-map--expand': expand }">
    <GoogleMap
      v-if="mapsApiKey && mappedHotels.length"
      ref="mapRef"
      :api-key="mapsApiKey"
      class="buyer-hotels-map__google"
      :center="center"
      :zoom="zoom"
      :clickable-icons="false"
    >
      <Marker
        v-for="hotel in mappedHotels"
        :key="hotelKey(hotel)"
        :options="markerOptions(hotel)"
        @click="onMarkerClick(hotel)"
      />
    </GoogleMap>

    <div v-else-if="mappedHotels.length" class="buyer-hotels-map__fallback">
      <p class="buyer-hotels-map__fallback-note">
        {{ mapsApiKey ? 'No mapped hotels yet.' : 'Simple map preview — add VITE_GOOGLE_MAPS_API_KEY for Google Maps.' }}
      </p>
      <div v-if="bounds" class="buyer-hotels-map__pins">
        <button
          v-for="hotel in mappedHotels"
          :key="hotelKey(hotel)"
          type="button"
          class="buyer-hotels-map__pin"
          :class="{ 'buyer-hotels-map__pin--active': isSelected(hotel) }"
          :style="pinPosition(hotel, bounds)"
          :title="hotelName(hotel)"
          @click="onMarkerClick(hotel)"
        >
          <Icon icon="solar:bed-bold" />
        </button>
      </div>
    </div>

    <div v-else class="buyer-hotels-map__empty">
      <Icon icon="solar:map-point-wave-bold" class="buyer-hotels-map__empty-icon" aria-hidden="true" />
      <p class="mb-0">No hotels with map coordinates yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import { Icon } from '@iconify/vue'
import {
  defaultMapCenter,
  hotelHasCoordinates,
  hotelId,
  hotelLatitude,
  hotelLongitude,
  hotelName,
  mapBounds,
  pinPosition,
  type HotelRow,
} from '@/utils/hotelListing'

const props = withDefaults(
  defineProps<{
    hotels: HotelRow[]
    centerLat?: number
    centerLng?: number
    selectedHotelId?: number | null
    expand?: boolean
  }>(),
  {
    centerLat: defaultMapCenter().lat,
    centerLng: defaultMapCenter().lng,
    selectedHotelId: null,
    expand: false,
  },
)

const emit = defineEmits<{ select: [hotel: HotelRow] }>()

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
const mapRef = ref<InstanceType<typeof GoogleMap> | null>(null)

const mappedHotels = computed(() => props.hotels.filter(hotelHasCoordinates))

const bounds = computed(() => mapBounds(mappedHotels.value))

const center = computed(() => {
  const selected = mappedHotels.value.find((h) => hotelId(h) === props.selectedHotelId)
  if (selected) {
    return { lat: hotelLatitude(selected)!, lng: hotelLongitude(selected)! }
  }
  if (bounds.value) {
    return {
      lat: (bounds.value.north + bounds.value.south) / 2,
      lng: (bounds.value.east + bounds.value.west) / 2,
    }
  }
  return { lat: props.centerLat, lng: props.centerLng }
})

const zoom = computed(() => {
  if (!bounds.value) return 13
  const latSpan = bounds.value.north - bounds.value.south
  const lngSpan = bounds.value.east - bounds.value.west
  const span = Math.max(latSpan, lngSpan)
  if (span < 0.02) return 14
  if (span < 0.05) return 13
  if (span < 0.15) return 12
  return 11
})

function hotelKey(hotel: HotelRow) {
  return String(hotelId(hotel) ?? hotel.business_name)
}

function isSelected(hotel: HotelRow) {
  return hotelId(hotel) === props.selectedHotelId
}

function markerOptions(hotel: HotelRow) {
  const selected = isSelected(hotel)
  return {
    position: { lat: hotelLatitude(hotel)!, lng: hotelLongitude(hotel)! },
    title: hotelName(hotel),
    zIndex: selected ? 2 : 1,
  }
}

function onMarkerClick(hotel: HotelRow) {
  emit('select', hotel)
}

watch(
  () => props.selectedHotelId,
  (id) => {
    if (!id || !mapsApiKey) return
    const row = mappedHotels.value.find((h) => hotelId(h) === id)
    if (!row) return
    const map = mapRef.value?.map
    if (map) {
      map.panTo({ lat: hotelLatitude(row)!, lng: hotelLongitude(row)! })
    }
  },
)
</script>

<style scoped>
.buyer-hotels-map {
  position: relative;
  border-radius: 1.1rem;
  overflow: hidden;
  border: 1px solid var(--buyer-border, rgba(92, 48, 143, 0.12));
  background: var(
    --buyer-map-bg,
    linear-gradient(135deg, #e8f4ea 0%, #dce8f5 50%, #f0e8f8 100%)
  );
  min-height: 240px;
}

.buyer-hotels-map--expand {
  min-height: 320px;
  height: 100%;
}

.buyer-hotels-map__google {
  width: 100%;
  height: 100%;
  min-height: inherit;
}

.buyer-hotels-map__fallback,
.buyer-hotels-map__empty {
  min-height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  color: var(--buyer-muted);
  font-size: 0.86rem;
}

.buyer-hotels-map__fallback-note {
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  color: var(--buyer-muted);
}

.buyer-hotels-map__pins {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 200px;
  border-radius: 0.85rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.35), transparent),
    repeating-linear-gradient(0deg, rgba(92, 48, 143, 0.04) 0, rgba(92, 48, 143, 0.04) 1px, transparent 1px, transparent 24px),
    repeating-linear-gradient(90deg, rgba(92, 48, 143, 0.04) 0, rgba(92, 48, 143, 0.04) 1px, transparent 1px, transparent 24px);
}

.buyer-hotels-map__pin {
  position: absolute;
  transform: translate(-50%, -100%);
  width: 2rem;
  height: 2rem;
  border-radius: 999px 999px 999px 0;
  rotate: -45deg;
  border: 2px solid var(--buyer-surface);
  background: var(--kkoo-primary);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(59, 26, 90, 0.25);
  font-size: 0.95rem;
}

.buyer-hotels-map__pin :deep(svg) {
  rotate: 45deg;
}

.buyer-hotels-map__pin--active {
  background: #f7a829;
  scale: 1.1;
  z-index: 2;
}

.buyer-hotels-map__empty-icon {
  font-size: 2rem;
  color: var(--kkoo-primary);
  margin-bottom: 0.5rem;
}
</style>
