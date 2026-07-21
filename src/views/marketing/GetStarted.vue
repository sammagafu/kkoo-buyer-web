<template>
  <MarketingLayout>
    <section class="lp-section gs-hero">
      <div class="lh-page gs-shell">
        <div class="gs-copy">
          <p class="gs-kicker">{{ copy.modal.eyebrow }}</p>
          <h1 class="gs-title">{{ copy.modal.title }}</h1>
          <p class="gs-lead">{{ copy.modal.hint }}</p>
        </div>

        <article class="gs-card">
          <div v-if="sent" class="gs-success">
            <p class="gs-kicker">{{ copy.modal.successEyebrow }}</p>
            <h2 class="gs-card-title">{{ copy.modal.successTitle }}</h2>
            <p class="gs-lead">{{ copy.modal.successHint }}</p>
            <LhButton as="router-link" :to="buyerRoutes.signUp" variant="primary" size="lg" with-well>
              {{ copy.modal.successCta }}
            </LhButton>
          </div>

          <form v-else class="gs-form" @submit.prevent="onSubmit">
            <label class="lh-field">
              <span>Name</span>
              <input v-model="name" name="name" required autocomplete="name" placeholder="Amina" />
            </label>
            <label class="lh-field">
              <span>Phone</span>
              <input
                v-model="phone"
                name="phone"
                type="tel"
                required
                autocomplete="tel"
                placeholder="+255 …"
              />
            </label>
            <label class="lh-field">
              <span>City</span>
              <select v-model="region" name="region">
                <option v-for="(r, i) in regions" :key="r" :value="r">
                  {{ r }}{{ i === 0 ? ' · recommended' : '' }}
                </option>
              </select>
            </label>
            <LhButton type="submit" variant="primary" size="lg" with-well>
              {{ copy.modal.submit }}
            </LhButton>
          </form>
        </article>
      </div>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MarketingLayout from './MarketingLayout.vue'
import LhButton from './partials/house/LhButton.vue'
import { houseCopy as copy, houseRegions as regions } from '@/config/landing-house'
import { buyerRoutes } from '@/config/landing-links'

const sent = ref(false)
const name = ref('')
const phone = ref('')
const region = ref<string>(regions[0])

function onSubmit() {
  sent.value = true
}
</script>

<style scoped>
.gs-hero {
  padding-block: clamp(2.5rem, 6vw, 4rem) !important;
}

.gs-shell {
  display: grid;
  gap: 1.5rem;
  align-items: start;
}

@media (min-width: 900px) {
  .gs-shell {
    grid-template-columns: minmax(0, 1fr) minmax(20rem, 24rem);
    gap: 2.5rem;
  }
}

.gs-kicker {
  margin: 0 0 0.5rem;
  font-family: var(--lh-font-display, 'Syne', sans-serif);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lh-eyebrow, #3b1a5a);
}

.gs-title {
  margin: 0;
  font-family: var(--lh-font-display, 'Syne', sans-serif);
  font-size: clamp(1.75rem, 3.2vw, 2.618rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  max-width: 12ch;
  color: var(--lh-text, #1a1a1a);
}

.gs-card-title {
  margin: 0 0 0.5rem;
  font-family: var(--lh-font-display, 'Syne', sans-serif);
  font-size: clamp(1.25rem, 2vw, 1.618rem);
  font-weight: 700;
  color: var(--lh-text, #1a1a1a);
}

.gs-lead {
  margin: 0.75rem 0 0;
  max-width: 36ch;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
}

.gs-card {
  padding: 1.35rem;
  border-radius: 1.25rem;
  border: 1px solid var(--lh-border, rgba(26, 26, 26, 0.08));
  background: var(--lh-surface, #fff);
}

.gs-form,
.gs-success {
  display: grid;
  gap: 0.9rem;
}

.gs-success .gs-lead {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
</style>
