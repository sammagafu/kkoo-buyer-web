<template>
  <MarketingLayout>
    <div class="context-nav">
      <div class="context-nav-left">
        <RouterLink :to="{ name: 'web.ride' }" class="context-nav-link">Ride &amp; delivery</RouterLink>
        <RouterLink :to="{ name: 'web.booking' }" class="context-nav-link">Hotels</RouterLink>
        <RouterLink :to="{ name: 'web.eats' }" class="context-nav-link">Eats</RouterLink>
      </div>
      <div class="context-nav-right">
        <RouterLink :to="{ name: 'web.checkout' }" class="context-nav-pill">Checkout</RouterLink>
        <RouterLink :to="{ name: 'web.favorites' }" class="context-nav-pill">Favorites</RouterLink>
      </div>
    </div>
    <section class="lp-section web-ride-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-ride-grid">
          <div>
            <p class="web-ride-kicker">KKOO Ride · Web</p>
            <h1 class="web-ride-title">Request a ride or delivery from the web.</h1>
            <p class="web-ride-copy">
              Enter pickup and dropoff details, choose vehicle type, and send the request. This uses the placeholder
              ride endpoint and will wire to production once available.
            </p>
          </div>
          <div class="web-ride-hero-card">
            <p class="fw-semibold mb-1">Status</p>
            <p class="small text-muted mb-0">{{ rideMessage || 'Fill the form to send a request.' }}</p>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <b-card class="web-ride-card">
          <header class="web-ride-head">
            <div>
              <p class="section-kicker">Ride request</p>
              <h2 class="section-title">Send a web ride/delivery request</h2>
            </div>
          </header>
          <b-form @submit.prevent="submit">
            <b-row class="gy-3">
              <b-col md="6">
                <b-form-group label="Pickup address" label-for="pickup">
                  <b-form-input id="pickup" v-model="form.pickup_address" required placeholder="e.g. Azikiwe St, Dar es Salaam" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Dropoff address" label-for="dropoff">
                  <b-form-input id="dropoff" v-model="form.dropoff_address" required placeholder="e.g. Mikocheni, Dar es Salaam" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Vehicle type" label-for="vehicle">
                  <b-form-select id="vehicle" v-model="form.vehicle_type" :options="vehicleOptions" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Payment method" label-for="payment">
                  <b-form-select id="payment" v-model="form.payment_method" :options="paymentOptions" />
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Notes (optional)" label-for="notes">
                  <b-form-textarea
                    id="notes"
                    v-model="form.rider_notes"
                    rows="2"
                    placeholder="Landmarks, building, delivery details"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <div class="d-flex align-items-center gap-2 mt-3">
              <b-button type="submit" variant="primary" size="lg" :disabled="submitting || !form.pickup_address || !form.dropoff_address">
                {{ submitting ? 'Sending…' : 'Request ride' }}
              </b-button>
              <span v-if="rideMessage" class="text-success small">{{ rideMessage }}</span>
              <span v-if="rideError" class="text-danger small">{{ rideError }}</span>
            </div>
          </b-form>
        </b-card>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <LocationPicker />
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { ridesApi, type RideRequestPayload } from '@/api/rides'
import LocationPicker from '@/components/LocationPicker.vue'

const form = reactive<RideRequestPayload>({
  pickup_address: '',
  dropoff_address: '',
  rider_notes: '',
  vehicle_type: 'bike',
  payment_method: 'cash',
})

const vehicleOptions = [
  { value: 'bike', text: 'Bike' },
  { value: 'car', text: 'Car' },
  { value: 'van', text: 'Van' },
]

const paymentOptions = [
  { value: 'cash', text: 'Cash' },
  { value: 'card', text: 'Card' },
]

const submitting = ref(false)
const rideMessage = ref('')
const rideError = ref('')

async function submit() {
  rideMessage.value = ''
  rideError.value = ''
  submitting.value = true
  try {
    const { data } = await ridesApi.requestRide(form)
    rideMessage.value = data?.message ?? 'Ride requested. A driver will be assigned if available.'
  } catch (e: any) {
    rideError.value = e?.response?.data?.detail ?? 'Could not send ride request.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.web-ride-hero {
  background:
    radial-gradient(circle at 22% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 82% 12%, rgba(247, 168, 41, 0.14), transparent 28%);
}
.web-ride-grid {
  display: grid;
  gap: 1.6rem;
  align-items: center;
}
@media (min-width: 992px) {
  .web-ride-grid {
    grid-template-columns: minmax(0, 1.3fr) minmax(260px, 0.8fr);
  }
}
.web-ride-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.web-ride-title {
  font-size: clamp(1.9rem, 4.2vw, 3.1rem);
  line-height: 1.05;
  margin: 0.6rem 0 0.7rem;
  max-width: 22ch;
}
.web-ride-copy {
  max-width: 62ch;
  color: var(--bs-secondary-color);
  line-height: 1.7;
}
.web-ride-hero-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 1.25rem;
  box-shadow: 0 16px 36px rgba(35, 20, 46, 0.12);
}
.web-ride-card {
  border-radius: 1.25rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  box-shadow: 0 14px 36px rgba(35, 20, 46, 0.1);
}
.app-btn {
  border-radius: 999px;
}
.app-btn.ghost {
  border-color: rgba(92, 48, 143, 0.18);
}
.web-ride-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
