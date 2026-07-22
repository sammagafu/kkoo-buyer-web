<template>
  <MarketingLayout>
    <section class="lp-section gs-hero">
      <div class="lh-page gs-shell">
        <div class="gs-copy">
          <p class="gs-kicker">{{ t('landingHouse.modal.eyebrow') }}</p>
          <h1 class="gs-title">{{ t('landingHouse.modal.title') }}</h1>
          <p class="gs-lead">{{ t('landingHouse.modal.hint') }}</p>
        </div>

        <article class="gs-card">
          <div v-if="sent" class="gs-success">
            <p class="gs-kicker">{{ t('landingHouse.modal.successEyebrow') }}</p>
            <h2 class="gs-card-title">{{ t('landingHouse.modal.successTitle') }}</h2>
            <p class="gs-lead">{{ t('landingHouse.modal.successHint') }}</p>
            <LhButton as="router-link" :to="buyerRoutes.signUp" variant="primary" size="lg" with-well>
              {{ t('landingHouse.modal.successCta') }}
            </LhButton>
          </div>

          <form v-else class="gs-form" @submit.prevent="onSubmit">
            <label class="lh-field">
              <span>{{ t('landingHouse.modal.name') }}</span>
              <input
                v-model="name"
                name="name"
                required
                autocomplete="name"
                :placeholder="t('landingHouse.modal.namePlaceholder')"
              />
            </label>
            <label class="lh-field">
              <span>{{ t('landingHouse.modal.phone') }}</span>
              <input
                v-model="phone"
                name="phone"
                type="tel"
                required
                autocomplete="tel"
                :placeholder="t('landingHouse.modal.phonePlaceholder')"
              />
            </label>
            <label class="lh-field">
              <span>{{ t('landingHouse.modal.city') }}</span>
              <select v-model="region" name="region">
                <option v-for="(key, i) in houseRegionKeys" :key="key" :value="key">
                  {{ t(`landingHouse.regions.${key}`) }}{{ i === 0 ? ` · ${t('landingHouse.modal.recommended')}` : '' }}
                </option>
              </select>
            </label>
            <LhButton type="submit" variant="primary" size="lg" with-well>
              {{ t('landingHouse.modal.submit') }}
            </LhButton>
          </form>
        </article>
      </div>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MarketingLayout from './MarketingLayout.vue'
import LhButton from './partials/house/LhButton.vue'
import { houseRegionKeys } from '@/config/landing-house'
import { buyerRoutes } from '@/config/landing-links'

const { t } = useI18n()
const sent = ref(false)
const name = ref('')
const phone = ref('')
const region = ref<string>(houseRegionKeys[0])

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
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
}

.gs-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lh-text-muted, #6b5c54);
}

.gs-title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.85rem, 4vw, 2.75rem);
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.gs-lead {
  margin: 0;
  color: var(--lh-text-muted, #6b5c54);
  line-height: 1.5;
}

.gs-card {
  padding: 1.35rem;
  border-radius: 1.35rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.gs-card-title {
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
}

.gs-form {
  display: grid;
  gap: 0.85rem;
}

.gs-success {
  display: grid;
  gap: 0.75rem;
}
</style>
