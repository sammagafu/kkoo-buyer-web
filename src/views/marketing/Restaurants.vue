<template>
  <MarketingLayout>
    <div class="context-nav">
      <div class="context-nav-left">
        <RouterLink :to="{ name: 'buyer.eats' }" class="context-nav-link">{{ t('restaurants.contextNav.eats') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.marketplace' }" class="context-nav-link">{{ t('restaurants.contextNav.marketplace') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.checkout' }" class="context-nav-link">{{ t('restaurants.contextNav.checkout') }}</RouterLink>
      </div>
      <div class="context-nav-right">
        <RouterLink :to="{ name: 'buyer.favorites' }" class="context-nav-pill">{{ t('restaurants.contextNav.favorites') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.ride' }" class="context-nav-pill">{{ t('restaurants.contextNav.ride') }}</RouterLink>
      </div>
    </div>

    <VerticalHero
      :eyebrow="t('restaurants.heroEyebrow')"
      :title="t('restaurants.heroTitle')"
      :title-accent="t('restaurants.heroTitleAccent')"
      :lead="t('restaurants.heroDesc')"
      :image="restaurantPlaceholder"
      :image-alt="t('restaurants.heroImageAlt')"
      :badge-label="t('restaurants.heroBadge.label')"
      :badge-title="t('restaurants.heroBadge.title', { count: restaurants.length || t('restaurants.heroBadge.live') })"
    >
      <template #actions>
        <RouterLink
          :to="{ name: 'buyer.eats' }"
          class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
        >
          <span class="lp-btn-pill__label">{{ t('restaurants.cta.orderOnWeb') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
          </span>
        </RouterLink>
        <RouterLink
          :to="{ name: 'buyer.checkout' }"
          class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
        >
          <span class="lp-btn-pill__label">{{ t('restaurants.cta.goToCheckout') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:cart-large-2-bold" class="lp-btn-pill__icon" />
          </span>
        </RouterLink>
      </template>
    </VerticalHero>

    <section class="vx-section lp-section directory-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <header class="vx-section__head">
          <p class="vx-kicker">{{ t('restaurants.sections.frontend.kicker') }}</p>
          <h2 class="vx-section__title">{{ t('restaurants.sections.frontend.title') }}</h2>
        </header>

        <p v-if="loading" class="directory-note">{{ t('restaurants.states.loading') }}</p>
        <p v-else-if="error" class="directory-note directory-note--error">{{ error }}</p>
        <p v-else class="directory-note">{{ t('restaurants.states.availableCount', { count: restaurants.length }) }}</p>

        <div class="directory-grid">
          <article v-for="restaurant in restaurants" :key="entryKey(restaurant)" class="vx-card directory-card">
            <div class="vx-card__media vx-card__placeholder">
              <Icon icon="solar:chef-hat-bold-duotone" />
            </div>
            <div class="vx-card__body">
              <div class="directory-card-top">
                <span class="directory-card-tag">{{ t('restaurants.card.tagRestaurant') }}</span>
                <span v-if="restaurant.prep_time_minutes" class="directory-card-tag directory-card-tag--soft">
                  {{ t('restaurants.card.prepTime', { minutes: restaurant.prep_time_minutes }) }}
                </span>
              </div>
              <h3 class="vx-card__title">{{ restaurant.business_name || t('restaurants.card.fallbackTitle') }}</h3>
              <p class="vx-card__copy">{{ restaurant.business_address || t('restaurants.card.fallbackCopy') }}</p>
              <div class="directory-facts">
                <span v-if="restaurant.contact_phone">{{ restaurant.contact_phone }}</span>
                <span v-if="restaurant.average_rating">{{ t('restaurants.card.rating', { rating: restaurant.average_rating }) }}</span>
              </div>
              <RouterLink
                v-if="storeSlug(restaurant)"
                :to="`/store/${encodeURIComponent(storeSlug(restaurant)!)}`"
                class="vx-card__cta"
              >
                {{ t('restaurants.card.viewMicrosite') }}
              </RouterLink>
            </div>
          </article>
        </div>
      </b-container>
    </section>

    <VerticalCardGrid
      class="directory-surface"
      :kicker="t('restaurants.sections.surfaces.kicker')"
      :title="t('restaurants.sections.surfaces.title')"
      :cards="touchpointCards"
      :columns="3"
    />

    <VerticalCardGrid
      class="walkthrough-surface"
      :kicker="t('restaurants.sections.walkthrough.kicker')"
      :title="t('restaurants.sections.walkthrough.title')"
      :cards="stepCards"
      :columns="3"
    />
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

import MarketingLayout from './MarketingLayout.vue'
import VerticalHero from './components/VerticalHero.vue'
import VerticalCardGrid from './components/VerticalCardGrid.vue'
import type { VerticalCard } from './components/VerticalCardGrid.vue'
import { superAppApi, type RestaurantListItem } from '@/api/superApp'
import { formatApiError } from '@/utils/formatApiError'
import restaurantPlaceholder from '@/assets/images/landing/placeholders/restaurant-hero-placeholder.svg'

const { t } = useI18n()

const loading = ref(true)
const error = ref('')
const restaurants = ref<RestaurantListItem[]>([])

const touchpointCards = computed<VerticalCard[]>(() => [
  {
    key: 'microsite',
    tag: t('restaurants.surfaces.1.tag'),
    title: t('restaurants.surfaces.1.title'),
    copy: t('restaurants.surfaces.1.copy'),
    icon: 'solar:shop-2-bold-duotone',
  },
  {
    key: 'eats',
    tag: t('restaurants.surfaces.2.tag'),
    title: t('restaurants.surfaces.2.title'),
    copy: t('restaurants.surfaces.2.copy'),
    icon: 'solar:cup-hot-bold-duotone',
  },
  {
    key: 'checkout',
    tag: t('restaurants.surfaces.3.tag'),
    title: t('restaurants.surfaces.3.title'),
    copy: t('restaurants.surfaces.3.copy'),
    icon: 'solar:cart-check-bold-duotone',
  },
])

const stepCards = computed<VerticalCard[]>(() =>
  [1, 2, 3].map((n) => ({
    key: `step-${n}`,
    tag: `0${n}`,
    title: t(`restaurants.steps.${n}.title`),
    copy: t(`restaurants.steps.${n}.copy`),
    icon: 'solar:map-arrow-right-bold-duotone',
  })),
)

function storeSlug(item: RestaurantListItem) {
  return item.menu_slug || item.seller_id || item.user_id || ''
}

function entryKey(item: RestaurantListItem) {
  return String(item.seller_id || item.user_id || item.menu_slug || Math.random())
}

onMounted(async () => {
  try {
    const { data } = await superAppApi.getRestaurants({ limit: 24 })
    restaurants.value = data?.results ?? []
  } catch (e) {
    error.value = formatApiError(e, t('restaurants.errors.loadFailed'))
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.directory-note {
  margin: 0 0 1rem;
  color: var(--lp-text-soft, var(--bs-secondary-color));
}

.directory-note--error {
  color: #c45a5a;
}

.directory-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .directory-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .directory-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.directory-card-top {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.directory-card-tag {
  display: inline-flex;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--bs-primary) 12%, transparent);
  color: var(--lp-heading-ink);
  font-size: 0.72rem;
  font-weight: 700;
}

.directory-card-tag--soft {
  background: color-mix(in srgb, var(--bs-secondary) 16%, transparent);
}

.directory-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--lp-text-soft);
}
</style>
