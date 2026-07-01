<template>
  <div class="buyer-ride">
    <div class="buyer-ride-layout">
      <div class="buyer-ride-main">
        <header class="buyer-ride-hero">
          <div class="buyer-ride-hero__icon" aria-hidden="true">
            <Icon :icon="isParcel ? 'solar:box-bold' : 'solar:scooter-bold'" />
          </div>
          <div class="buyer-ride-hero__copy">
            <p class="buyer-ride-hero__kicker">{{ kicker }}</p>
            <h1 class="buyer-ride-hero__title">{{ stepTitle }}</h1>
            <p class="buyer-ride-hero__tagline">{{ stepHint }}</p>
          </div>
        </header>

        <div class="buyer-ride-history-link d-lg-none">
          <RouterLink
            :to="{ name: 'buyer.rides' }"
            class="buyer-venue__chip"
            @click="onHistoryNav"
          >
            <Icon icon="solar:history-bold" aria-hidden="true" />
            {{ historyLabel }}
          </RouterLink>
        </div>

        <div class="buyer-ride-steps" role="tablist" :aria-label="t('buyerXp.ride.stepNavLabel')">
          <button
            v-for="(step, index) in visibleSteps"
            :key="step.id"
            type="button"
            role="tab"
            class="buyer-ride-step"
            :class="{
              'buyer-ride-step--active': currentStep === index,
              'buyer-ride-step--done': index < currentStep,
              'buyer-ride-step--reachable': canNavigateToStep(index) && index !== currentStep,
              'buyer-ride-step--locked': !canNavigateToStep(index) && index !== currentStep,
            }"
            :aria-selected="currentStep === index"
            :aria-disabled="!canNavigateToStep(index) && index !== currentStep"
            @click="onStepClick(index)"
          >
            {{ step.label }}
          </button>
        </div>

        <p v-if="stepError" class="buyer-ride-msg buyer-ride-msg--err buyer-ride-msg--steps">{{ stepError }}</p>

        <!-- Step 1: Where -->
        <section v-if="currentStep === 0" class="buyer-ride-step-panel" :aria-label="visibleSteps[0]?.label">
          <div class="buyer-ride-card buyer-ride-route-card">
            <div class="buyer-ride-route-card__rail" aria-hidden="true" />
            <div class="buyer-ride-route-card__fields">
              <RidePlaceField
                id="pickup"
                v-model:label="pickup.label"
                v-model:lat="pickup.lat"
                v-model:lng="pickup.lng"
                v-model:map-place-id="pickup.mapPlaceId"
                :title="pickupTitle"
                :placeholder="pickupPlaceholder"
                marker="pickup"
              />
              <RidePlaceField
                id="dropoff"
                v-model:label="dropoff.label"
                v-model:lat="dropoff.lat"
                v-model:lng="dropoff.lng"
                v-model:map-place-id="dropoff.mapPlaceId"
                :title="dropoffTitle"
                :placeholder="dropoffPlaceholder"
                marker="dropoff"
              />
            </div>
            <button
              type="button"
              class="buyer-ride-swap"
              :aria-label="swapLabel"
              :disabled="!canSwap"
              @click="swapRoute"
            >
              <Icon icon="solar:transfer-vertical-bold" />
            </button>
          </div>

          <div v-if="isParcel" class="buyer-ride-card">
            <p class="buyer-section-head__overline mb-2">{{ descriptionLabel }}</p>
            <textarea
              v-model="notes"
              class="buyer-ride-notes"
              rows="2"
              :placeholder="descriptionPlaceholder"
            />
          </div>

        </section>

        <!-- Step 2: Ride (vehicle) -->
        <section
          v-else-if="!isParcel && currentStep === 1"
          class="buyer-ride-step-panel"
          :aria-label="visibleSteps[1]?.label"
        >
          <div class="buyer-ride-card">
            <p class="buyer-section-head__overline mb-2">{{ vehicleLabel }}</p>
            <div class="buyer-ride-vehicles" role="radiogroup" :aria-label="vehicleLabel">
              <button
                v-for="v in vehicles"
                :key="v.id"
                type="button"
                class="buyer-ride-vehicle"
                :class="{ 'buyer-ride-vehicle--active': vehicleType === v.id }"
                :aria-pressed="vehicleType === v.id"
                @click="vehicleType = v.id"
              >
                <Icon :icon="v.icon" class="buyer-ride-vehicle__icon" aria-hidden="true" />
                {{ v.label }}
              </button>
            </div>
          </div>

          <BuyerRideRouteSummary
            compact
            :pickup-title="pickupTitle"
            :dropoff-title="dropoffTitle"
            :pickup-address="pickup.label"
            :dropoff-address="dropoff.label"
            :aria-label="t('buyerXp.ride.routeSummary')"
          />
        </section>

        <!-- Final step: Go -->
        <section
          v-else-if="currentStep === lastStepIndex"
          class="buyer-ride-step-panel"
          :aria-label="visibleSteps[lastStepIndex]?.label"
        >
          <div class="buyer-ride-card buyer-ride-review">
            <p class="buyer-section-head__overline mb-2">{{ t('buyerXp.ride.stepReviewTitle') }}</p>
            <BuyerRideRouteSummary
              class="mb-3"
              :pickup-title="pickupTitle"
              :dropoff-title="dropoffTitle"
              :pickup-address="pickup.label"
              :dropoff-address="dropoff.label"
              :aria-label="t('buyerXp.ride.routeSummary')"
            />
            <dl class="buyer-ride-review__list">
              <div v-if="!isParcel" class="buyer-ride-review__row">
                <dt>{{ vehicleLabel }}</dt>
                <dd>{{ selectedVehicleLabel }}</dd>
              </div>
              <div v-if="isParcel && notes.trim()" class="buyer-ride-review__row">
                <dt>{{ descriptionLabel }}</dt>
                <dd>{{ notes.trim() }}</dd>
              </div>
            </dl>
          </div>

          <div v-if="quoting" class="buyer-ride-fare buyer-ride-fare--inline">
            <span class="buyer-ride-fare__label">{{ t('buyerXp.ride.quoteLoading') }}</span>
          </div>
          <div v-else-if="estimatedFare != null" class="buyer-ride-fare buyer-ride-fare--inline">
            <span class="buyer-ride-fare__label">{{ fareLabel }}</span>
            <strong class="buyer-ride-fare__amount">{{ formatPrice(estimatedFare) }}</strong>
          </div>

          <p v-if="!auth.isAuthenticated && currentStep === lastStepIndex" class="buyer-ride-msg buyer-ride-msg--hint">
            {{ isParcel ? t('buyerXp.parcel.signInPrompt') : t('buyerXp.ride.signInPrompt') }}
          </p>
          <p v-if="bookingError" class="buyer-ride-msg buyer-ride-msg--err">{{ bookingError }}</p>
        </section>

        <div class="buyer-ride-bar buyer-ride-bar--inline d-none d-lg-flex">
          <button
            v-if="currentStep > 0"
            type="button"
            class="buyer-ride-bar__btn buyer-ride-bar__btn--secondary"
            :disabled="submitting"
            @click="prevStep"
          >
            {{ t('buyerXp.ride.stepBack') }}
          </button>
          <button
            type="button"
            class="buyer-ride-bar__btn"
            :disabled="primaryDisabled"
            @click="onPrimaryAction"
          >
            <Icon :icon="primaryIcon" aria-hidden="true" />
            {{ primaryLabel }}
          </button>
        </div>
      </div>

      <aside class="buyer-ride-aside" aria-label="Ride summary">
        <div class="buyer-ride-aside__card">
          <p class="buyer-ride-aside__title">{{ asideTitle }}</p>
          <p class="buyer-ride-aside__text">{{ asideBody }}</p>
          <RouterLink :to="{ name: 'buyer.rides' }" class="buyer-ride-aside__link" @click="onHistoryNav">
            {{ historyLabel }}
            <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
          </RouterLink>
        </div>
        <div v-if="estimatedFare != null && currentStep === lastStepIndex" class="buyer-ride-fare buyer-ride-fare--aside">
          <span class="buyer-ride-fare__label">{{ fareLabel }}</span>
          <strong class="buyer-ride-fare__amount">{{ formatPrice(estimatedFare) }}</strong>
        </div>
      </aside>
    </div>

    <div class="buyer-ride-bar buyer-ride-bar--mobile d-lg-none">
      <button
        v-if="currentStep > 0"
        type="button"
        class="buyer-ride-bar__btn buyer-ride-bar__btn--secondary"
        :disabled="submitting"
        @click="prevStep"
      >
        {{ t('buyerXp.ride.stepBack') }}
      </button>
      <button
        type="button"
        class="buyer-ride-bar__btn"
        :disabled="primaryDisabled"
        @click="onPrimaryAction"
      >
        <Icon :icon="primaryIcon" aria-hidden="true" />
        {{ primaryLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { ridesApi } from '@/api/rides'
import RidePlaceField from '@/components/buyer/RidePlaceField.vue'
import BuyerRideRouteSummary from '@/components/buyer/experience/BuyerRideRouteSummary.vue'
import { useAuthStore } from '@/stores/auth'
import { isAuthSessionError } from '@/utils/authRedirect'

const props = withDefaults(
  defineProps<{
    mode?: 'ride' | 'parcel'
  }>(),
  { mode: 'ride' },
)

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()

type PlacePin = { label: string; lat: number | null; lng: number | null; mapPlaceId: number | null }

const pickup = reactive<PlacePin>({ label: '', lat: null, lng: null, mapPlaceId: null })
const dropoff = reactive<PlacePin>({ label: '', lat: null, lng: null, mapPlaceId: null })
const vehicleType = ref('boda')
const notes = ref('')
const submitting = ref(false)
const quoting = ref(false)
const bookingError = ref('')
const stepError = ref('')
const estimatedFare = ref<number | null>(null)
const currentStep = ref(0)
const furthestStep = ref(0)

const isParcel = computed(() => props.mode === 'parcel')
const lastStepIndex = computed(() => (isParcel.value ? 1 : 2))

const kicker = computed(() => (isParcel.value ? t('buyerXp.parcel.overline') : t('buyerXp.ride.overline')))
const pickupTitle = computed(() => (isParcel.value ? t('buyerXp.parcel.pickup') : t('buyerXp.ride.pickup')))
const dropoffTitle = computed(() => (isParcel.value ? t('buyerXp.parcel.dropoff') : t('buyerXp.ride.dropoff')))
const pickupPlaceholder = computed(() =>
  isParcel.value ? t('buyerXp.parcel.pickupPlaceholder') : t('buyerXp.ride.pickupPlaceholder'),
)
const dropoffPlaceholder = computed(() =>
  isParcel.value ? t('buyerXp.parcel.dropoffPlaceholder') : t('buyerXp.ride.dropoffPlaceholder'),
)
const swapLabel = computed(() => (isParcel.value ? t('buyerXp.parcel.swap') : t('buyerXp.ride.swap')))
const descriptionLabel = computed(() => t('buyerXp.parcel.description'))
const descriptionPlaceholder = computed(() => t('buyerXp.parcel.descriptionPlaceholder'))
const vehicleLabel = computed(() => t('buyerXp.ride.vehicle'))
const fareLabel = computed(() =>
  isParcel.value ? t('buyerXp.parcel.estimatedFare') : t('buyerXp.ride.estimatedFare'),
)
const submitLabel = computed(() =>
  isParcel.value ? t('buyerXp.parcel.sendParcel') : t('buyerXp.ride.requestRide'),
)
const submittingLabel = computed(() =>
  isParcel.value ? t('buyerXp.parcel.sending') : t('buyerXp.ride.requesting'),
)
const submitIcon = computed(() => (isParcel.value ? 'solar:box-bold' : 'solar:scooter-bold'))
const historyLabel = computed(() => t('buyerXp.ride.historyTitle'))
const asideTitle = computed(() => t('buyerXp.ride.asideTitle'))
const asideBody = computed(() => t('buyerXp.ride.asideBody'))

const rideSteps = computed(() => [
  { id: 'where', label: t('buyerXp.ride.stepWhere'), title: t('buyerXp.ride.title'), hint: t('buyerXp.ride.stepWhereHint') },
  { id: 'ride', label: t('buyerXp.ride.stepRide'), title: t('buyerXp.ride.stepRideTitle'), hint: t('buyerXp.ride.stepRideHint') },
  { id: 'go', label: t('buyerXp.ride.stepGo'), title: t('buyerXp.ride.stepGoTitle'), hint: t('buyerXp.ride.stepGoHint') },
])

const parcelSteps = computed(() => [
  { id: 'where', label: t('buyerXp.ride.stepWhere'), title: t('buyerXp.parcel.title'), hint: t('buyerXp.ride.stepWhereHint') },
  { id: 'go', label: t('buyerXp.ride.stepGo'), title: t('buyerXp.ride.stepGoTitle'), hint: t('buyerXp.ride.stepGoHint') },
])

const visibleSteps = computed(() => (isParcel.value ? parcelSteps.value : rideSteps.value))

const stepTitle = computed(() => visibleSteps.value[currentStep.value]?.title ?? titleFallback.value)
const stepHint = computed(() => visibleSteps.value[currentStep.value]?.hint ?? '')
const titleFallback = computed(() => (isParcel.value ? t('buyerXp.parcel.title') : t('buyerXp.ride.title')))

const vehicles = computed(() => [
  { id: 'boda', label: t('buyerXp.ride.boda'), icon: 'solar:scooter-bold' },
  { id: 'bajaj', label: t('buyerXp.ride.bajaj'), icon: 'solar:bus-bold' },
  { id: 'car', label: t('buyerXp.ride.car'), icon: 'solar:car-bold' },
])

const selectedVehicleLabel = computed(
  () => vehicles.value.find((v) => v.id === vehicleType.value)?.label ?? vehicleType.value,
)

const hasRoute = computed(
  () =>
    Boolean(pickup.label.trim()) &&
    Boolean(dropoff.label.trim()) &&
    pickup.lat != null &&
    pickup.lng != null &&
    dropoff.lat != null &&
    dropoff.lng != null,
)

const canSwap = computed(
  () => Boolean(pickup.label.trim() || dropoff.label.trim() || pickup.lat != null || dropoff.lat != null),
)

const canBook = computed(
  () => hasRoute.value && estimatedFare.value != null && estimatedFare.value > 0,
)

const isLastStep = computed(() => currentStep.value === lastStepIndex.value)

const primaryLabel = computed(() => {
  if (submitting.value) return submittingLabel.value
  if (isLastStep.value && !auth.isAuthenticated) {
    return isParcel.value ? t('buyerXp.parcel.signInToSend') : t('buyerXp.ride.signInToBook')
  }
  if (isLastStep.value) return submitLabel.value
  return t('buyerXp.ride.stepNext')
})

const primaryIcon = computed(() => (isLastStep.value ? submitIcon.value : 'solar:arrow-right-linear'))

const primaryDisabled = computed(() => {
  if (submitting.value || quoting.value) return true
  if (isLastStep.value) return !canBook.value
  if (currentStep.value === 0) return !hasRoute.value
  return false
})

function onHistoryNav(event: MouseEvent) {
  if (auth.isAuthenticated) return
  event.preventDefault()
  void router.push({
    name: 'auth.sign-in',
    query: { redirectedFrom: router.resolve({ name: 'buyer.rides' }).fullPath },
  })
}

function formatPrice(val: number) {
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function swapRoute() {
  const p = { ...pickup }
  pickup.label = dropoff.label
  pickup.lat = dropoff.lat
  pickup.lng = dropoff.lng
  pickup.mapPlaceId = dropoff.mapPlaceId
  dropoff.label = p.label
  dropoff.lat = p.lat
  dropoff.lng = p.lng
  dropoff.mapPlaceId = p.mapPlaceId
  estimatedFare.value = null
}

function canAdvanceFrom(step: number) {
  if (step === 0) return hasRoute.value
  if (!isParcel.value && step === 1) return true
  return false
}

function canNavigateToStep(index: number) {
  if (index === currentStep.value) return true
  if (index < currentStep.value) return true
  if (index <= furthestStep.value) return true
  if (index === currentStep.value + 1) return canAdvanceFrom(currentStep.value)
  return false
}

function markStepReached(step: number) {
  if (step > furthestStep.value) furthestStep.value = step
}

function goToStep(index: number) {
  stepError.value = ''
  bookingError.value = ''
  currentStep.value = index
}

async function onStepClick(index: number) {
  stepError.value = ''
  bookingError.value = ''

  if (index === currentStep.value) return

  if (index < currentStep.value || (index <= furthestStep.value && index !== currentStep.value + 1)) {
    goToStep(index)
    return
  }

  if (index === currentStep.value + 1) {
    if (!canAdvanceFrom(currentStep.value)) {
      stepError.value = t('buyerXp.ride.routeRequired')
      return
    }
    await nextStep()
    return
  }

  if (index > currentStep.value) {
    stepError.value = t('buyerXp.ride.completePreviousStep')
  }
}

function prevStep() {
  stepError.value = ''
  bookingError.value = ''
  if (currentStep.value > 0) currentStep.value -= 1
}

async function refreshQuote() {
  if (!hasRoute.value) {
    estimatedFare.value = null
    return false
  }
  quoting.value = true
  try {
    const { data } = await ridesApi.getQuote({
      pickup_lat: pickup.lat!,
      pickup_lng: pickup.lng!,
      dropoff_lat: dropoff.lat!,
      dropoff_lng: dropoff.lng!,
      vehicle_type: vehicleType.value,
    })
    const fee = (data as { total_fee?: number })?.total_fee
    estimatedFare.value = typeof fee === 'number' ? fee : null
    return estimatedFare.value != null && estimatedFare.value > 0
  } catch {
    estimatedFare.value = null
    return false
  } finally {
    quoting.value = false
  }
}

async function nextStep() {
  stepError.value = ''
  bookingError.value = ''

  if (currentStep.value === 0) {
    if (!hasRoute.value) {
      stepError.value = t('buyerXp.ride.routeRequired')
      return
    }
    if (isParcel.value) {
      const ok = await refreshQuote()
      if (!ok) {
        stepError.value = t('buyerXp.ride.quoteUnavailable')
        return
      }
      currentStep.value = 1
      markStepReached(1)
      return
    }
    currentStep.value = 1
    markStepReached(1)
    return
  }

  if (!isParcel.value && currentStep.value === 1) {
    const ok = await refreshQuote()
    if (!ok) {
      stepError.value = t('buyerXp.ride.quoteUnavailable')
      return
    }
    currentStep.value = 2
    markStepReached(2)
  }
}

function onPrimaryAction() {
  if (isLastStep.value) {
    void submit()
    return
  }
  void nextStep()
}

async function submit() {
  bookingError.value = ''
  if (!canBook.value || estimatedFare.value == null) return

  if (!auth.isAuthenticated) {
    await router.push({ name: 'auth.sign-in', query: { redirectedFrom: route.fullPath } })
    return
  }

  submitting.value = true
  try {
    const { data } = await ridesApi.requestRide({
      pickup_address: pickup.label.trim(),
      dropoff_address: dropoff.label.trim(),
      pickup_lat: pickup.lat!,
      pickup_lng: pickup.lng!,
      dropoff_lat: dropoff.lat!,
      dropoff_lng: dropoff.lng!,
      pickup_map_place_id: pickup.mapPlaceId ?? undefined,
      dropoff_map_place_id: dropoff.mapPlaceId ?? undefined,
      fare: estimatedFare.value,
      vehicle_type: vehicleType.value,
      trip_type: isParcel.value ? 'parcel' : 'passenger',
      rider_notes: notes.value.trim() || undefined,
    })
    const id = (data as { id?: number })?.id
    if (id) {
      await router.push({ name: 'buyer.ride.detail', params: { id: String(id) } })
    }
  } catch (e: unknown) {
    if (isAuthSessionError(e)) return
    const err = e as { response?: { data?: { detail?: string; error?: string } } }
    bookingError.value =
      err.response?.data?.detail ??
      err.response?.data?.error ??
      (isParcel.value ? t('buyerXp.parcel.couldNotSend') : t('buyerXp.ride.couldNotBook'))
  } finally {
    submitting.value = false
  }
}

watch(
  () => [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng, vehicleType.value] as const,
  () => {
    estimatedFare.value = null
    if (currentStep.value === lastStepIndex.value) void refreshQuote()
  },
)

watch(hasRoute, (ok) => {
  if (!ok) {
    if (currentStep.value > 0) currentStep.value = 0
    furthestStep.value = 0
    estimatedFare.value = null
  }
})

onMounted(() => {
  const p = String(route.query.pickup ?? '').trim()
  const d = String(route.query.dropoff ?? '').trim()
  if (p) pickup.label = p
  if (d) dropoff.label = d
})
</script>
