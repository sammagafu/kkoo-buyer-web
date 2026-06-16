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
    <section class="lp-section restaurant-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="directory-hero-grid">
          <div>
            <p class="directory-eyebrow">{{ t('restaurants.heroEyebrow') }}</p>
            <h1 class="directory-title">
              {{ t('restaurants.heroTitle') }}
              <span>{{ t('restaurants.heroTitleAccent') }}</span>
            </h1>
            <p class="directory-lead">
              {{ t('restaurants.heroDesc') }}
            </p>
            <div class="directory-actions">
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
            </div>
          </div>

          <article class="directory-hero-visual">
            <img :src="restaurantPlaceholder" :alt="t('restaurants.heroImageAlt')" class="directory-hero-image" />
            <div class="directory-hero-badge">
              <span>{{ t('restaurants.heroBadge.label') }}</span>
              <strong>{{ t('restaurants.heroBadge.title', { count: restaurants.length || t('restaurants.heroBadge.live') }) }}</strong>
            </div>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section directory-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('restaurants.sections.frontend.kicker') }}</p>
          <h2 class="section-title">{{ t('restaurants.sections.frontend.title') }}</h2>
          <p class="section-copy">{{ t('restaurants.sections.frontend.copy') }}</p>
        </div>

        <div class="directory-meta">
          <p v-if="loading" class="directory-note">{{ t('restaurants.states.loading') }}</p>
          <p v-else-if="error" class="directory-note directory-note--error">{{ error }}</p>
          <p v-else class="directory-note">{{ t('restaurants.states.availableCount', { count: restaurants.length }) }}</p>
        </div>

        <div class="directory-grid">
          <article v-for="restaurant in restaurants" :key="entryKey(restaurant)" class="directory-card">
            <div class="directory-card-top">
              <span class="directory-card-tag">{{ t('restaurants.card.tagRestaurant') }}</span>
              <span v-if="restaurant.prep_time_minutes" class="directory-card-tag directory-card-tag--soft">
                {{ t('restaurants.card.prepTime', { minutes: restaurant.prep_time_minutes }) }}
              </span>
            </div>
            <h3>{{ restaurant.business_name || t('restaurants.card.fallbackTitle') }}</h3>
            <p class="directory-card-copy">
              {{ restaurant.business_address || t('restaurants.card.fallbackCopy') }}
            </p>
            <div class="directory-facts">
              <span v-if="restaurant.contact_phone">{{ restaurant.contact_phone }}</span>
              <span v-if="restaurant.opening_hours">{{ restaurant.opening_hours }}</span>
              <span v-if="restaurant.average_rating">{{ t('restaurants.card.rating', { rating: restaurant.average_rating }) }}</span>
            </div>
            <div class="directory-card-actions">
              <RouterLink
                v-if="storeSlug(restaurant)"
                :to="`/store/${encodeURIComponent(storeSlug(restaurant)!)}`"
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label">{{ t('restaurants.card.viewMicrosite') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </RouterLink>
            </div>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section walkthrough-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('restaurants.sections.surfaces.kicker') }}</p>
          <h2 class="section-title">{{ t('restaurants.sections.surfaces.title') }}</h2>
          <p class="section-copy">{{ t('restaurants.sections.surfaces.copy') }}</p>
        </div>
        <div class="walkthrough-grid mb-4">
          <article v-for="surface in restaurantSurfaces" :key="surface.title" class="directory-card">
            <span class="directory-card-tag">{{ surface.tag }}</span>
            <h3>{{ surface.title }}</h3>
            <p class="directory-card-copy">{{ surface.copy }}</p>
          </article>
        </div>
        <div class="section-heading">
          <p class="section-kicker">{{ t('restaurants.sections.walkthrough.kicker') }}</p>
          <h2 class="section-title">{{ t('restaurants.sections.walkthrough.title') }}</h2>
          <p class="section-copy">{{ t('restaurants.sections.walkthrough.copy') }}</p>
        </div>
        <div class="walkthrough-grid">
          <article v-for="(step, index) in orderSteps" :key="step.title" class="directory-card">
            <span class="directory-card-tag">0{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p class="directory-card-copy">{{ step.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

import MarketingLayout from './MarketingLayout.vue'
import { appLinks } from '@/config/app-links'
import { superAppApi, type RestaurantListItem } from '@/api/superApp'
import { formatApiError } from '@/utils/formatApiError'
import restaurantPlaceholder from '@/assets/images/landing/placeholders/restaurant-hero-placeholder.svg'

const { t } = useI18n()

const loading = ref(true)
const error = ref('')
const restaurants = ref<RestaurantListItem[]>([])
const restaurantSurfaces = computed(() => [
  {
    tag: t('restaurants.surfaces.1.tag'),
    title: t('restaurants.surfaces.1.title'),
    copy: t('restaurants.surfaces.1.copy'),
  },
  {
    tag: t('restaurants.surfaces.2.tag'),
    title: t('restaurants.surfaces.2.title'),
    copy: t('restaurants.surfaces.2.copy'),
  },
  {
    tag: t('restaurants.surfaces.3.tag'),
    title: t('restaurants.surfaces.3.title'),
    copy: t('restaurants.surfaces.3.copy'),
  },
])
const orderSteps = computed(() => [
  {
    title: t('restaurants.steps.1.title'),
    copy: t('restaurants.steps.1.copy'),
  },
  {
    title: t('restaurants.steps.2.title'),
    copy: t('restaurants.steps.2.copy'),
  },
  {
    title: t('restaurants.steps.3.title'),
    copy: t('restaurants.steps.3.copy'),
  },
])

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
.restaurant-hero {
  background:
    radial-gradient(circle at top left, rgba(247, 168, 41, 0.18), transparent 30%),
    radial-gradient(circle at 82% 18%, rgba(92, 48, 143, 0.18), transparent 28%);
}

.directory-hero-grid {
  display: grid;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 992px) {
  .directory-hero-grid {
    grid-template-columns: minmax(0, 1fr) minmax(340px, 460px);
  }
}

.directory-eyebrow {
  margin-bottom: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  font-weight: 800;
  color: #5c308f;
}

.directory-title {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 0.96;
  letter-spacing: -0.04em;
  margin-bottom: 1rem;
  max-width: 10ch;
}

.directory-title span {
  display: block;
  color: #5c308f;
}

.directory-lead {
  max-width: 60ch;
  font-size: 1.02rem;
  line-height: 1.78;
  color: var(--bs-secondary-color);
}

.directory-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.4rem;
}

.directory-hero-visual {
  position: relative;
}

.directory-hero-image {
  width: 100%;
  display: block;
  border-radius: 2rem;
  box-shadow: 0 28px 70px rgba(35, 20, 46, 0.16);
}

.directory-hero-badge {
  position: absolute;
  left: 1.2rem;
  right: 1.2rem;
  bottom: 1.2rem;
  padding: 1rem 1.1rem;
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(92, 48, 143, 0.12);
  box-shadow: 0 14px 32px rgba(35, 20, 46, 0.1);
}

.directory-hero-badge span {
  display: block;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--bs-secondary-color);
}

.directory-hero-badge strong {
  display: block;
  margin-top: 0.35rem;
  font-size: 1rem;
}

.directory-surface {
  background:
    radial-gradient(circle at right top, rgba(92, 48, 143, 0.08), transparent 30%),
    linear-gradient(180deg, rgba(92, 48, 143, 0.03), rgba(92, 48, 143, 0.01));
}

.walkthrough-surface {
  background:
    radial-gradient(circle at left top, rgba(247, 168, 41, 0.09), transparent 30%),
    linear-gradient(180deg, rgba(92, 48, 143, 0.02), rgba(92, 48, 143, 0.01));
}

.walkthrough-grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .walkthrough-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.directory-note {
  margin: 0 0 1.1rem;
  color: var(--bs-secondary-color);
}

.directory-note--error {
  color: #a13b3b;
}

.directory-grid {
  display: grid;
  gap: 1.25rem;
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

.directory-card {
  padding: 1.35rem;
  border-radius: 1.35rem;
}

.directory-card-top {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}

.directory-card-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.12);
  color: #5c308f;
  font-size: 0.74rem;
  font-weight: 700;
}

.directory-card-tag--soft {
  background: rgba(247, 168, 41, 0.16);
  color: #8e5c00;
}

.directory-card h3 {
  margin-bottom: 0.55rem;
  font-size: 1.1rem;
}

.directory-card-copy {
  min-height: 4.7rem;
  color: var(--bs-secondary-color);
  line-height: 1.68;
}

.directory-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin: 0.95rem 0 1.1rem;
  color: var(--bs-secondary-color);
  font-size: 0.88rem;
}
</style>
