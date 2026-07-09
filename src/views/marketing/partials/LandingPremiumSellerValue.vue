<template>
  <section id="seller-value" class="lp-bento-section lp-seller-value">
    <div class="ui-container">
      <header class="lp-seller-value__head ui-reveal">
        <p class="lp-seller-value__eyebrow">{{ t('landing.sellerValue.eyebrow') }}</p>
        <h2 class="lp-bento-section__title">{{ t('landing.sellerValue.title') }}</h2>
        <p class="lp-seller-value__lead">{{ t('landing.sellerValue.lead') }}</p>
      </header>

      <div class="lp-seller-value__grid" role="list">
        <article
          v-for="item in valueItems"
          :key="item.key"
          class="lp-seller-value__card ui-reveal"
          role="listitem"
        >
          <span class="lp-seller-value__icon" aria-hidden="true">
            <Icon :icon="item.icon" />
          </span>
          <h3 class="lp-seller-value__card-title">{{ t(item.titleKey) }}</h3>
          <p class="lp-seller-value__card-desc">{{ t(item.descKey) }}</p>
        </article>
      </div>

      <div class="lp-seller-value__actions ui-reveal">
        <a
          :href="bizSellerRegisterUrl"
          class="lp-seller-value__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('landing.footerBecomeSeller') }}
          <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
        </a>
        <router-link :to="buyerRoutes.business" class="lp-seller-value__link">
          {{ t('landing.sellerValue.learnMore') }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { bizSellerRegisterUrl, buyerRoutes } from '@/config/landing-links'

const { t } = useI18n()

const valueItems = [
  { key: 'payouts', icon: 'solar:wallet-money-bold', titleKey: 'landing.sellerValue.payoutsTitle', descKey: 'landing.sellerValue.payoutsDesc' },
  { key: 'deni', icon: 'solar:notebook-bold', titleKey: 'landing.sellerValue.deniTitle', descKey: 'landing.sellerValue.deniDesc' },
  { key: 'whatsapp', icon: 'solar:chat-round-dots-bold', titleKey: 'landing.sellerValue.whatsappTitle', descKey: 'landing.sellerValue.whatsappDesc' },
  { key: 'lowdata', icon: 'solar:smartphone-2-bold', titleKey: 'landing.sellerValue.lowDataTitle', descKey: 'landing.sellerValue.lowDataDesc' },
  { key: 'crm', icon: 'solar:document-text-bold', titleKey: 'landing.sellerValue.crmTitle', descKey: 'landing.sellerValue.crmDesc' },
  { key: 'delivery', icon: 'solar:delivery-bold', titleKey: 'landing.sellerValue.deliveryTitle', descKey: 'landing.sellerValue.deliveryDesc' },
] as const
</script>

<style scoped>
/* Mobile-first: single column, comfortable tap/reading sizes; grid widens upward. */
.lp-seller-value__head {
  max-width: 40rem;
  margin: 0 auto 1.75rem;
  text-align: center;
}

.lp-seller-value__eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--bs-primary);
}

.lp-seller-value__lead {
  margin: 0.75rem 0 0;
  font-size: 1rem;
  line-height: 1.55;
  color: rgba(var(--bs-body-color-rgb), 0.68);
}

.lp-seller-value__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}

@media (min-width: 576px) {
  .lp-seller-value__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .lp-seller-value__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

.lp-seller-value__card {
  padding: 1.15rem 1.15rem 1.25rem;
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.08);
  border-radius: 1rem;
  background: var(--bs-body-bg);
}

.lp-seller-value__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  margin-bottom: 0.7rem;
  border-radius: 0.75rem;
  font-size: 1.25rem;
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
}

.lp-seller-value__card-title {
  margin: 0 0 0.3rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

.lp-seller-value__card-desc {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: rgba(var(--bs-body-color-rgb), 0.66);
}

.lp-seller-value__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

@media (min-width: 576px) {
  .lp-seller-value__actions {
    flex-direction: row;
    justify-content: center;
  }
}

.lp-seller-value__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-width: 12rem;
  min-height: 3rem;
  padding: 0.7rem 1.75rem;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  background: var(--bs-primary);
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lp-seller-value__cta:hover {
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(var(--bs-primary-rgb), 0.35);
}

.lp-seller-value__link {
  font-weight: 600;
  text-decoration: none;
  color: var(--bs-primary);
}
</style>
