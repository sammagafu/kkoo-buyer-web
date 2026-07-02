<template>
  <section id="sell-section" class="lp-audience lp-audience--seller">
    <div class="ui-container">
      <header class="lp-audience__head ui-reveal">
        <p class="lp-audience__eyebrow">{{ t('landing.premium.sellerEyebrow') }}</p>
        <h2 class="lp-audience__title">{{ t('landing.premium.sellerTitle') }}</h2>
        <p class="lp-audience__lead">{{ t('landing.premium.sellerLead') }}</p>
      </header>

      <div class="lp-audience__pills" role="list">
        <span
          v-for="pill in sellerBenefitPills"
          :key="pill.key"
          class="lp-audience__pill"
          role="listitem"
        >
          <Icon :icon="pill.icon" aria-hidden="true" />
          {{ t(pill.labelKey) }}
        </span>
      </div>

      <div class="lp-audience__body">
        <div class="lp-audience__steps" :aria-label="t('landing.premium.sellerStepsAria')">
          <article v-for="step in sellerOnboardingSteps" :key="step.key" class="lp-audience__step ui-reveal">
            <div class="lp-audience__step-mark" aria-hidden="true">
              <Icon :icon="step.icon" class="lp-audience__step-icon" />
            </div>
            <div class="lp-audience__step-copy">
              <h3 class="lp-audience__step-title">{{ t(step.titleKey) }}</h3>
              <p class="lp-audience__step-desc">{{ t(step.descKey) }}</p>
            </div>
          </article>
        </div>

        <aside class="lp-audience__panel">
          <form class="lp-seller-form" @submit.prevent="onSubmit">
            <h3 class="lp-seller-form__title">{{ t('landing.premium.sellerFormTitle') }}</h3>
            <p class="lp-seller-form__lead">{{ t('landing.premium.sellerFormLead') }}</p>

            <label class="lp-seller-form__field">
              <span>{{ t('landing.premium.sellerFormName') }}</span>
              <input v-model="name" type="text" required autocomplete="name" />
            </label>
            <label class="lp-seller-form__field">
              <span>{{ t('landing.premium.sellerFormPhone') }}</span>
              <input v-model="phone" type="tel" required autocomplete="tel" />
            </label>
            <label class="lp-seller-form__field">
              <span>{{ t('landing.premium.sellerFormType') }}</span>
              <select v-model="businessType" required>
                <option v-for="opt in sellerBusinessTypes" :key="opt.value" :value="opt.value">
                  {{ t(opt.labelKey) }}
                </option>
              </select>
            </label>

            <button type="submit" class="lp-bento-btn lp-bento-btn--primary w-100">
              {{ t('landing.premium.sellerCta') }}
              <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
            </button>
          </form>

          <div class="lp-seller-calc">
            <h4 class="lp-seller-calc__title">{{ t('landing.premium.sellerCalcTitle') }}</h4>
            <p class="lp-seller-calc__lead">{{ t('landing.premium.sellerCalcLead') }}</p>
            <label class="lp-seller-form__field">
              <span>{{ t('landing.premium.sellerCalcOrders') }}</span>
              <input v-model.number="ordersPerMonth" type="range" min="10" max="500" step="10" />
              <output>{{ ordersPerMonth }} {{ t('landing.premium.sellerCalcOrdersUnit') }}</output>
            </label>
            <p class="lp-seller-calc__result">
              {{ t('landing.premium.sellerCalcResult', { amount: formattedEstimate }) }}
            </p>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import {
  bizSellerRegisterUrl,
  sellerBenefitPills,
  sellerBusinessTypes,
  sellerOnboardingSteps,
} from '@/config/landing-audiences'

const { t } = useI18n()

const name = ref('')
const phone = ref('')
const businessType = ref(sellerBusinessTypes[0].value)
const ordersPerMonth = ref(80)

const formattedEstimate = computed(() => {
  const avgOrderTzs = 45000
  const margin = 0.22
  const monthly = Math.round(ordersPerMonth.value * avgOrderTzs * margin)
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(monthly)
})

function onSubmit() {
  const params = new URLSearchParams({
    name: name.value.trim(),
    phone: phone.value.trim(),
    type: businessType.value,
  })
  window.location.href = `${bizSellerRegisterUrl}?${params.toString()}`
}
</script>
