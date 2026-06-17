<template>
  <MarketingLayout>
    <div class="context-nav">
      <div class="context-nav-left">
        <RouterLink :to="{ name: 'buyer.booking' }" class="context-nav-link">{{ t('hotels.context.bookStay') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.eats' }" class="context-nav-link">{{ t('hotels.context.eats') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.checkout' }" class="context-nav-link">{{ t('hotels.context.checkout') }}</RouterLink>
      </div>
      <div class="context-nav-right">
        <RouterLink :to="{ name: 'buyer.compare' }" class="context-nav-pill">{{ t('hotels.context.compare') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.ride' }" class="context-nav-pill">{{ t('hotels.context.ride') }}</RouterLink>
      </div>
    </div>

    <VerticalHero
      :eyebrow="t('hotels.hero.eyebrow')"
      :title="t('hotels.hero.title1')"
      :title-accent="t('hotels.hero.title2')"
      :lead="t('hotels.hero.lead')"
      :image="hotelPlaceholder"
      :image-alt="t('hotels.hero.imageAlt')"
      :badge-label="t('hotels.hero.badgeLabel')"
      :badge-title="`${hotels.length || t('hotels.hero.badgeFallback')} ${t('hotels.hero.badgeSuffix')}`"
    >
      <template #actions>
        <RouterLink
          :to="{ name: 'buyer.booking' }"
          class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
        >
          <span class="lp-btn-pill__label">{{ t('hotels.hero.ctaBookWeb') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
          </span>
        </RouterLink>
        <RouterLink
          :to="{ name: 'buyer.checkout' }"
          class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
        >
          <span class="lp-btn-pill__label">{{ t('hotels.hero.ctaCheckout') }}</span>
          <span class="lp-btn-pill__well" aria-hidden="true">
            <Icon icon="solar:cart-large-2-bold" class="lp-btn-pill__icon" />
          </span>
        </RouterLink>
      </template>
    </VerticalHero>

    <section class="vx-section lp-section directory-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <header class="vx-section__head">
          <p class="vx-kicker">{{ t('hotels.sections.directory.kicker') }}</p>
          <h2 class="vx-section__title">{{ t('hotels.sections.directory.title') }}</h2>
        </header>

        <p v-if="loading" class="directory-note">{{ t('hotels.directory.loading') }}</p>
        <p v-else-if="error" class="directory-note directory-note--error">{{ error }}</p>
        <p v-else class="directory-note">{{ t('hotels.directory.available', { count: hotels.length }) }}</p>

        <div class="directory-grid">
          <article v-for="hotel in hotels" :key="entryKey(hotel)" class="vx-card directory-card">
            <div class="vx-card__media vx-card__placeholder">
              <Icon icon="solar:bed-bold-duotone" />
            </div>
            <div class="vx-card__body">
              <div class="directory-card-top">
                <span class="directory-card-tag">{{ t('hotels.directory.tagHotel') }}</span>
              </div>
              <h3 class="vx-card__title">{{ hotel.business_name || t('hotels.directory.fallbackName') }}</h3>
              <p class="vx-card__copy">{{ hotel.business_address || t('hotels.directory.fallbackAddress') }}</p>
              <div class="directory-facts">
                <span v-if="hotel.contact_phone">{{ hotel.contact_phone }}</span>
              </div>
              <RouterLink
                v-if="storeSlug(hotel)"
                :to="`/store/${encodeURIComponent(storeSlug(hotel)!)}`"
                class="vx-card__cta"
              >
                {{ t('hotels.directory.viewMicrosite') }}
              </RouterLink>
            </div>
          </article>
        </div>
      </b-container>
    </section>

    <VerticalCardGrid
      class="directory-surface"
      :kicker="t('hotels.sections.surfaces.kicker')"
      :title="t('hotels.sections.surfaces.title')"
      :cards="surfaceCards"
      :columns="3"
    />

    <VerticalCardGrid
      class="walkthrough-surface"
      :kicker="t('hotels.sections.walkthrough.kicker')"
      :title="t('hotels.sections.walkthrough.title')"
      :cards="stepCards"
      :columns="3"
    />
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

import MarketingLayout from './MarketingLayout.vue'
import VerticalHero from './components/VerticalHero.vue'
import VerticalCardGrid from './components/VerticalCardGrid.vue'
import type { VerticalCard } from './components/VerticalCardGrid.vue'
import { superAppApi, type HotelListItem } from '@/api/superApp'
import { formatApiError } from '@/utils/formatApiError'
import hotelPlaceholder from '@/assets/images/landing/placeholders/hotel-hero-placeholder.svg'

const { t } = useI18n()

const loading = ref(true)
const error = ref('')
const hotels = ref<HotelListItem[]>([])

const surfaceCards = computed<VerticalCard[]>(() =>
  [1, 2, 3].map((n) => ({
    key: `surface-${n}`,
    tag: t(`hotels.surfaces.${n}.tag`),
    title: t(`hotels.surfaces.${n}.title`),
    copy: t(`hotels.surfaces.${n}.copy`),
    icon: 'solar:buildings-3-bold-duotone',
  })),
)

const stepCards = computed<VerticalCard[]>(() =>
  [1, 2, 3].map((n) => ({
    key: `step-${n}`,
    tag: `0${n}`,
    title: t(`hotels.bookingSteps.${n}.title`),
    copy: t(`hotels.bookingSteps.${n}.copy`),
    icon: 'solar:calendar-bold-duotone',
  })),
)

function storeSlug(item: HotelListItem) {
  return item.menu_slug || item.seller_id || item.user_id || ''
}

function entryKey(item: HotelListItem) {
  return String(item.seller_id || item.user_id || item.menu_slug || Math.random())
}

onMounted(async () => {
  try {
    const { data } = await superAppApi.getHotels({ limit: 24 })
    hotels.value = data?.results ?? []
  } catch (e) {
    error.value = formatApiError(e, t('hotels.directory.failedToLoad'))
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
  font-size: 0.72rem;
  font-weight: 700;
}

.directory-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--lp-text-soft);
}
</style>
