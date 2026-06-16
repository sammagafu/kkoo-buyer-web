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
    <section class="lp-section hotel-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="directory-hero-grid">
          <div>
            <p class="directory-eyebrow">{{ t('hotels.hero.eyebrow') }}</p>
            <h1 class="directory-title">
              {{ t('hotels.hero.title1') }}
              <span>{{ t('hotels.hero.title2') }}</span>
            </h1>
            <p class="directory-lead">
              {{ t('hotels.hero.lead') }}
            </p>
            <div class="directory-actions">
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
            </div>
          </div>

          <article class="directory-hero-visual">
            <img :src="hotelPlaceholder" :alt="t('hotels.hero.imageAlt')" class="directory-hero-image" />
            <div class="directory-hero-badge">
              <span>{{ t('hotels.hero.badgeLabel') }}</span>
              <strong>{{ hotels.length || t('hotels.hero.badgeFallback') }} {{ t('hotels.hero.badgeSuffix') }}</strong>
            </div>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section directory-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading">
          <p class="section-kicker">{{ t('hotels.sections.directory.kicker') }}</p>
          <h2 class="section-title">{{ t('hotels.sections.directory.title') }}</h2>
          <p class="section-copy">{{ t('hotels.sections.directory.copy') }}</p>
        </div>

        <div class="directory-meta">
          <p v-if="loading" class="directory-note">{{ t('hotels.directory.loading') }}</p>
          <p v-else-if="error" class="directory-note directory-note--error">{{ error }}</p>
          <p v-else class="directory-note">{{ t('hotels.directory.available', { count: hotels.length }) }}</p>
        </div>

        <div class="directory-grid">
          <article v-for="hotel in hotels" :key="entryKey(hotel)" class="directory-card">
            <div class="directory-card-top">
              <span class="directory-card-tag">{{ t('hotels.directory.tagHotel') }}</span>
              <span v-if="hotel.opening_hours" class="directory-card-tag directory-card-tag--soft">{{ t('hotels.directory.tagOpenDetails') }}</span>
            </div>
            <h3>{{ hotel.business_name || t('hotels.directory.fallbackName') }}</h3>
            <p class="directory-card-copy">
              {{ hotel.business_address || t('hotels.directory.fallbackAddress') }}
            </p>
            <div class="directory-facts">
              <span v-if="hotel.contact_phone">{{ hotel.contact_phone }}</span>
              <span v-if="hotel.opening_hours">{{ hotel.opening_hours }}</span>
            </div>
            <div class="directory-card-actions">
              <RouterLink
                v-if="storeSlug(hotel)"
                :to="`/store/${encodeURIComponent(storeSlug(hotel)!)}`"
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label">{{ t('hotels.directory.viewMicrosite') }}</span>
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
          <p class="section-kicker">{{ t('hotels.sections.surfaces.kicker') }}</p>
          <h2 class="section-title">{{ t('hotels.sections.surfaces.title') }}</h2>
          <p class="section-copy">{{ t('hotels.sections.surfaces.copy') }}</p>
        </div>
        <div class="walkthrough-grid mb-4">
          <article v-for="surface in hotelSurfaces" :key="surface.title" class="directory-card">
            <span class="directory-card-tag">{{ surface.tag }}</span>
            <h3>{{ surface.title }}</h3>
            <p class="directory-card-copy">{{ surface.copy }}</p>
          </article>
        </div>
        <div class="section-heading">
          <p class="section-kicker">{{ t('hotels.sections.walkthrough.kicker') }}</p>
          <h2 class="section-title">{{ t('hotels.sections.walkthrough.title') }}</h2>
          <p class="section-copy">{{ t('hotels.sections.walkthrough.copy') }}</p>
        </div>
        <div class="walkthrough-grid">
          <article v-for="(step, index) in bookingSteps" :key="step.title" class="directory-card">
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
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

import MarketingLayout from './MarketingLayout.vue'
import { appLinks } from '@/config/app-links'
import { superAppApi, type HotelListItem } from '@/api/superApp'
import { formatApiError } from '@/utils/formatApiError'
import hotelPlaceholder from '@/assets/images/landing/placeholders/hotel-hero-placeholder.svg'

const { t } = useI18n()

const loading = ref(true)
const error = ref('')
const hotels = ref<HotelListItem[]>([])
const hotelSurfaces = computed(() => [
  {
    tag: t('hotels.surfaces.1.tag'),
    title: t('hotels.surfaces.1.title'),
    copy: t('hotels.surfaces.1.copy'),
  },
  {
    tag: t('hotels.surfaces.2.tag'),
    title: t('hotels.surfaces.2.title'),
    copy: t('hotels.surfaces.2.copy'),
  },
  {
    tag: t('hotels.surfaces.3.tag'),
    title: t('hotels.surfaces.3.title'),
    copy: t('hotels.surfaces.3.copy'),
  },
])
const bookingSteps = computed(() => [
  {
    title: t('hotels.bookingSteps.1.title'),
    copy: t('hotels.bookingSteps.1.copy'),
  },
  {
    title: t('hotels.bookingSteps.2.title'),
    copy: t('hotels.bookingSteps.2.copy'),
  },
  {
    title: t('hotels.bookingSteps.3.title'),
    copy: t('hotels.bookingSteps.3.copy'),
  },
])

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
.hotel-hero {
  background:
    radial-gradient(circle at top left, rgba(92, 48, 143, 0.16), transparent 30%),
    radial-gradient(circle at 82% 18%, rgba(247, 168, 41, 0.16), transparent 28%);
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
    radial-gradient(circle at right top, rgba(247, 168, 41, 0.08), transparent 30%),
    linear-gradient(180deg, rgba(92, 48, 143, 0.03), rgba(92, 48, 143, 0.01));
}

.walkthrough-surface {
  background:
    radial-gradient(circle at left top, rgba(92, 48, 143, 0.08), transparent 30%),
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
