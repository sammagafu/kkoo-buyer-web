<template>
  <div class="lp-sisyphus">
    <!-- Hero -->
    <section id="top" class="lp-sisyphus-hero">
      <div class="container-lg">
        <div class="lp-sisyphus-hero__social">
          <div class="lp-sisyphus-hero__avatars" aria-hidden="true">
            <img v-for="(av, i) in socialAvatars" :key="i" :src="av" alt="" />
          </div>
          <span class="lp-sisyphus-hero__social-text">{{ t('landing.sisyphus.socialProof') }}</span>
        </div>

        <h1 class="lp-sisyphus-hero__title">
          {{ t('landing.sisyphus.heroLine1') }}
          <span class="lp-sisyphus-accent">{{ t('landing.sisyphus.heroAccent') }}</span>
        </h1>
        <p class="lp-sisyphus-hero__lead">{{ t('landing.heroSubtitle') }}</p>

        <div class="lp-sisyphus-hero__visual">
          <img :src="heroImage" :alt="t('landing.sisyphus.heroImageAlt')" class="lp-sisyphus-hero__photo" />
          <div class="lp-sisyphus-stats" role="list">
            <article
              v-for="(stat, i) in heroStats"
              :key="stat.key"
              class="lp-sisyphus-stats__card"
              :class="{ 'lp-sisyphus-stats__card--featured': i === 0 }"
              role="listitem"
            >
              <span v-if="i === 0" class="lp-sisyphus-stats__icon" aria-hidden="true">
                <Icon icon="solar:users-group-rounded-bold" />
              </span>
              <h3 class="lp-sisyphus-stats__value">{{ stat.value }}</h3>
              <p class="lp-sisyphus-stats__label">{{ stat.label }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Regions -->
    <section id="regions" class="lp-sisyphus-section">
      <div class="container-lg">
        <div class="lp-sisyphus-section__head lp-sisyphus-section__head--split">
          <h2 class="lp-sisyphus-section__title">
            {{ t('landing.sisyphus.regionsLine1') }}
            <span class="lp-sisyphus-accent">{{ t('landing.sisyphus.regionsAccent') }}</span>
          </h2>
          <p class="lp-sisyphus-section__desc">{{ t('landing.sisyphus.regionsDesc') }}</p>
        </div>

        <div class="lp-sisyphus-regions">
          <component
            v-for="card in premiumRegionCards"
            :key="card.key"
            :is="regionCardTag(card)"
            :href="regionCardHref(card)"
            :to="regionCardTo(card)"
            class="lp-sisyphus-regions__card"
            :aria-label="t(card.labelKey)"
            @click="onRegionCardClick(card, $event)"
          >
            <img :src="card.image" :alt="t(card.altKey)" loading="lazy" />
            <span class="lp-sisyphus-regions__pill">
              <Icon :icon="card.icon" aria-hidden="true" />
              {{ t(card.labelKey) }}
            </span>
          </component>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="lp-sisyphus-section lp-sisyphus-section--muted">
      <div class="container-lg">
        <div class="lp-sisyphus-section__head lp-sisyphus-section__head--row">
          <h2 class="lp-sisyphus-section__title">
            {{ t('landing.sisyphus.servicesLine1') }}
            <span class="lp-sisyphus-accent">{{ t('landing.sisyphus.servicesAccent') }}</span>
          </h2>
          <router-link :to="buyerRoutes.marketplace" class="lp-sisyphus-btn lp-sisyphus-btn--outline">
            {{ t('landing.sisyphus.servicesCta') }}
            <Icon icon="solar:arrow-right-up-linear" />
          </router-link>
        </div>

        <div class="lp-sisyphus-services" role="list">
          <component
            v-for="(svc, i) in serviceCards"
            :key="svc.key"
            :is="svc.href ? 'a' : 'router-link'"
            :href="svc.href"
            :to="svc.to"
            class="lp-sisyphus-services__card text-decoration-none"
            :class="{ 'lp-sisyphus-services__card--featured': i === featuredServiceIndex }"
            :target="svc.href ? '_blank' : undefined"
            :rel="svc.href ? 'noopener noreferrer' : undefined"
            role="listitem"
          >
            <span class="lp-sisyphus-services__icon" aria-hidden="true">
              <Icon :icon="svc.icon" />
            </span>
            <h3 class="lp-sisyphus-services__title">{{ t(svc.labelKey) }}</h3>
            <p class="lp-sisyphus-services__desc">{{ t(svc.descKey) }}</p>
            <span class="lp-sisyphus-services__link">
              {{ t('landing.sisyphus.learnMore') }}
              <Icon icon="solar:arrow-right-linear" />
            </span>
          </component>
        </div>
      </div>
    </section>

    <!-- Showcase / portfolio -->
    <section id="showcase" class="lp-sisyphus-section">
      <div class="container-lg">
        <div class="lp-sisyphus-section__head lp-sisyphus-section__head--row">
          <h2 class="lp-sisyphus-section__title">
            {{ t('landing.sisyphus.showcaseLine1') }}
            <span class="lp-sisyphus-accent">{{ t('landing.sisyphus.showcaseAccent') }}</span>
          </h2>
          <div class="lp-sisyphus-section__actions">
            <router-link :to="landingAnchors.download" class="lp-sisyphus-btn lp-sisyphus-btn--primary">
              {{ t('landing.headerGetApp') }}
            </router-link>
            <router-link :to="buyerRoutes.marketplace" class="lp-sisyphus-btn lp-sisyphus-btn--outline">
              {{ t('landing.ctaShopOnWeb') }}
            </router-link>
          </div>
        </div>

        <div class="lp-sisyphus-showcase" role="list">
          <article
            v-for="item in showcaseItems"
            :key="item.key"
            class="lp-sisyphus-showcase__card"
            :class="{ 'lp-sisyphus-showcase__card--wide': item.wide }"
            role="listitem"
          >
            <div class="lp-sisyphus-showcase__frame">
              <img :src="item.image" :alt="t(item.altKey)" loading="lazy" />
            </div>
            <div class="lp-sisyphus-showcase__meta">
              <h3>{{ t(item.titleKey) }}</h3>
              <p>{{ t(item.descKey) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="stories" class="lp-sisyphus-section lp-sisyphus-section--muted">
      <div class="container-lg">
        <div class="lp-sisyphus-section__head lp-sisyphus-section__head--row">
          <h2 class="lp-sisyphus-section__title">
            {{ t('landing.sisyphus.testimonialsLine1') }}
            <span class="lp-sisyphus-accent">{{ t('landing.sisyphus.testimonialsAccent') }}</span>
          </h2>
          <div class="lp-sisyphus-carousel-nav" aria-hidden="true">
            <button type="button" class="lp-sisyphus-carousel-nav__btn" @click="prevTestimonial">
              <Icon icon="solar:alt-arrow-left-linear" />
            </button>
            <button type="button" class="lp-sisyphus-carousel-nav__btn" @click="nextTestimonial">
              <Icon icon="solar:alt-arrow-right-linear" />
            </button>
          </div>
        </div>

        <div class="lp-sisyphus-testimonials" role="list">
          <article
            v-for="(item, i) in visibleTestimonials"
            :key="item.name"
            class="lp-sisyphus-testimonials__card"
            :class="{ 'lp-sisyphus-testimonials__card--featured': i === 1 }"
            role="listitem"
          >
            <div class="lp-sisyphus-testimonials__profile">
              <span class="lp-sisyphus-testimonials__avatar" aria-hidden="true">{{ item.initials }}</span>
              <div>
                <p class="lp-sisyphus-testimonials__name">{{ item.name }}</p>
                <p class="lp-sisyphus-testimonials__role">{{ item.role }}</p>
              </div>
            </div>
            <p class="lp-sisyphus-testimonials__quote">{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Earn -->
    <section id="earn" class="lp-sisyphus-section">
      <div class="container-lg">
        <header class="lp-sisyphus-section__head text-center mx-auto">
          <h2 class="lp-sisyphus-section__title">
            {{ t('landing.superApp.earnHeadline') }}
          </h2>
          <p class="lp-sisyphus-section__desc mx-auto">{{ t('landing.superApp.earnLead') }}</p>
        </header>
        <div class="lp-sisyphus-earn" role="list">
          <component
            v-for="card in superAppEarnCards"
            :key="card.key"
            :is="card.href ? 'a' : 'router-link'"
            :href="card.href"
            :to="card.to"
            class="lp-sisyphus-earn__card text-decoration-none"
            :target="card.href ? '_blank' : undefined"
            :rel="card.href ? 'noopener noreferrer' : undefined"
            role="listitem"
          >
            <Icon :icon="card.icon" class="lp-sisyphus-earn__icon" aria-hidden="true" />
            <h3>{{ t(card.labelKey) }}</h3>
            <p>{{ t(card.descKey) }}</p>
            <span>{{ t('landing.superApp.earnCta') }} →</span>
          </component>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { buyerRoutes, landingAnchors } from '@/config/landing-links'
import { premiumRegionCards, type PremiumRegionCard } from '@/config/landing-premium'
import { superAppEarnCards, superAppServiceGroups } from '@/config/landing-superapp'
import { useLandingPillar } from '@/composables/useLandingPillar'
import { useLandingScroll } from '@/composables/useLandingScroll'
import heroImage from '@/assets/landing/hero.jpg'
import shopImage from '@/assets/landing/services/shop.jpg'
import foodImage from '@/assets/landing/services/food.jpg'
import catImage from '@/assets/landing/cat.jpg'
import groceriesImage from '@/assets/images/landing/services/groceries.jpg'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'

const { t } = useI18n()
const { onAnchorClick } = useLandingScroll()
const { navigateToPillar } = useLandingPillar()

function regionCardTag(card: PremiumRegionCard) {
  return card.link.kind === 'route' ? 'router-link' : 'a'
}

function regionCardHref(card: PremiumRegionCard) {
  if (card.link.kind === 'pillar') return `#services-${card.link.pillar}`
  if (card.link.kind === 'anchor') return `#${card.link.sectionId}`
  return undefined
}

function regionCardTo(card: PremiumRegionCard) {
  return card.link.kind === 'route' ? card.link.to : undefined
}

function onRegionCardClick(card: PremiumRegionCard, event: MouseEvent) {
  if (card.link.kind === 'route') return
  event.preventDefault()
  if (card.link.kind === 'pillar') {
    navigateToPillar(card.link.pillar)
    return
  }
  onAnchorClick(card.link.sectionId, event)
}

const socialAvatars = [avatar1, avatar2, avatar3]

const heroStats = [
  { key: 'users', value: '50K+', label: 'Active users' },
  { key: 'years', value: '13+', label: 'Years building' },
  { key: 'services', value: '20+', label: 'Services' },
  { key: 'orders', value: '10K+', label: 'Orders delivered' },
]

const consumerItems = superAppServiceGroups.consumer.flatMap((g) => g.items)
const serviceCards = consumerItems.slice(0, 6)
const featuredServiceIndex = 1

const showcaseItems = [
  { key: 'market', wide: true, image: shopImage, titleKey: 'landing.navMarketplace', descKey: 'landing.superApp.marketplaceDesc', altKey: 'landing.navMarketplace' },
  { key: 'eats', wide: false, image: foodImage, titleKey: 'landing.navEats', descKey: 'landing.superApp.eatsDesc', altKey: 'landing.navEats' },
  { key: 'grocery', wide: false, image: groceriesImage, titleKey: 'landing.navGrocery', descKey: 'landing.superApp.groceryDesc', altKey: 'landing.navGrocery' },
  { key: 'community', wide: false, image: catImage, titleKey: 'landing.navCommunity', descKey: 'landing.superApp.communityDesc', altKey: 'landing.navCommunity' },
]

type Testimonial = { name: string; role: string; text: string; initials: string }

const allTestimonials = computed<Testimonial[]>(() => [
  {
    name: t('landing.testimonial1Name'),
    role: t('landing.testimonial1Role'),
    text: t('landing.testimonial1Text'),
    initials: 'AM',
  },
  {
    name: t('landing.testimonial2Name'),
    role: t('landing.testimonial2Role'),
    text: t('landing.testimonial2Text'),
    initials: 'DK',
  },
  {
    name: t('landing.testimonial3Name'),
    role: t('landing.testimonial3Role'),
    text: t('landing.testimonial3Text'),
    initials: 'FM',
  },
  {
    name: t('landing.testimonial4Name'),
    role: t('landing.testimonial4Role'),
    text: t('landing.testimonial4Text'),
    initials: 'HK',
  },
])

const testimonialOffset = ref(0)

const visibleTestimonials = computed(() => {
  const items = allTestimonials.value
  const len = items.length
  if (len <= 3) return items
  const start = testimonialOffset.value % len
  return [0, 1, 2].map((i) => items[(start + i) % len])
})

function nextTestimonial() {
  testimonialOffset.value = (testimonialOffset.value + 1) % allTestimonials.value.length
}

function prevTestimonial() {
  const len = allTestimonials.value.length
  testimonialOffset.value = (testimonialOffset.value - 1 + len) % len
}
</script>

<style scoped>
.lp-sisyphus {
  --lp-sis-accent: var(--bs-primary, #5c308f);
  --lp-sis-ink: #111827;
  --lp-sis-muted: #6b7280;
  --lp-sis-surface: #ffffff;
  --lp-sis-muted-bg: #f3f4f6;
  --lp-sis-radius: 1.5rem;
  --lp-sis-radius-lg: 2rem;
  color: var(--lp-sis-ink);
}

html[data-bs-theme='dark'] .lp-sisyphus {
  --lp-sis-ink: #f3f4f6;
  --lp-sis-muted: #9ca3af;
  --lp-sis-surface: #111827;
  --lp-sis-muted-bg: #1f2937;
}

.lp-sisyphus-accent {
  color: var(--lp-sis-accent);
}

/* Hero */
.lp-sisyphus-hero {
  padding: clamp(2rem, 5vw, 3.5rem) 0 0;
  background: var(--lp-sis-surface);
}

.lp-sisyphus-hero__social {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.lp-sisyphus-hero__avatars {
  display: flex;
}

.lp-sisyphus-hero__avatars img {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 2px solid var(--lp-sis-surface);
  margin-left: -0.55rem;
  object-fit: cover;
}

.lp-sisyphus-hero__avatars img:first-child {
  margin-left: 0;
}

.lp-sisyphus-hero__social-text {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--lp-sis-muted);
}

.lp-sisyphus-hero__title {
  max-width: 14ch;
  margin: 0 0 1rem;
  font-size: clamp(2.25rem, 5.5vw, 3.75rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.lp-sisyphus-hero__lead {
  max-width: 36rem;
  margin: 0 0 2rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--lp-sis-muted);
}

.lp-sisyphus-hero__visual {
  position: relative;
  padding-bottom: 4.5rem;
}

.lp-sisyphus-hero__photo {
  width: 100%;
  max-height: 28rem;
  object-fit: cover;
  border-radius: var(--lp-sis-radius-lg);
  display: block;
}

.lp-sisyphus-stats {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: min(100%, 56rem);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
  padding: 0.85rem;
  border-radius: var(--lp-sis-radius-lg);
  background: #111827;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
}

@media (max-width: 767.98px) {
  .lp-sisyphus-stats {
    grid-template-columns: repeat(2, 1fr);
    position: relative;
    left: auto;
    transform: none;
    margin-top: -2rem;
  }

  .lp-sisyphus-hero__visual {
    padding-bottom: 0;
  }
}

.lp-sisyphus-stats__card {
  padding: 1rem 0.85rem;
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  text-align: left;
}

.lp-sisyphus-stats__card--featured {
  background: var(--lp-sis-accent);
}

.lp-sisyphus-stats__icon {
  display: inline-flex;
  margin-bottom: 0.35rem;
  font-size: 1.1rem;
  opacity: 0.9;
}

.lp-sisyphus-stats__value {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.1;
}

.lp-sisyphus-stats__label {
  margin: 0.2rem 0 0;
  font-size: 0.72rem;
  line-height: 1.3;
  opacity: 0.85;
}

/* Sections */
.lp-sisyphus-section {
  padding: clamp(3.5rem, 8vw, 5.5rem) 0;
  background: var(--lp-sis-surface);
}

.lp-sisyphus-section--muted {
  background: var(--lp-sis-muted-bg);
}

.lp-sisyphus-section__head {
  margin-bottom: 2rem;
}

.lp-sisyphus-section__head--split {
  display: grid;
  gap: 1rem;
}

@media (min-width: 992px) {
  .lp-sisyphus-section__head--split {
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: 2rem;
  }
}

.lp-sisyphus-section__head--row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.lp-sisyphus-section__title {
  margin: 0;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.lp-sisyphus-section__desc {
  margin: 0;
  max-width: 32rem;
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--lp-sis-muted);
}

.lp-sisyphus-section__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.lp-sisyphus-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.15rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.lp-sisyphus-btn--primary {
  background: var(--lp-sis-accent);
  color: #fff;
}

.lp-sisyphus-btn--outline {
  border-color: rgba(var(--bs-body-color-rgb), 0.12);
  color: inherit;
  background: var(--lp-sis-surface);
}

.lp-sisyphus-btn:hover {
  transform: translateY(-1px);
  color: inherit;
}

.lp-sisyphus-btn--primary:hover {
  color: #fff;
}

/* Regions */
.lp-sisyphus-regions {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .lp-sisyphus-regions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.lp-sisyphus-regions__card {
  position: relative;
  margin: 0;
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: var(--lp-sis-radius-lg);
  overflow: hidden;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.lp-sisyphus-regions__card:hover {
  transform: translateY(-4px);
}

.lp-sisyphus-regions__card:focus-visible {
  outline: 2px solid var(--lp-sis-primary, #5d318e);
  outline-offset: 3px;
}

.lp-sisyphus-regions__card img {
  width: 100%;
  height: 100%;
  min-height: 14rem;
  object-fit: cover;
  display: block;
}

.lp-sisyphus-regions__card--main img {
  min-height: 18rem;
}

.lp-sisyphus-regions__pill {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  background: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(8px);
}

/* Services grid */
.lp-sisyphus-services {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
}

@media (min-width: 992px) {
  .lp-sisyphus-services {
    grid-template-columns: repeat(3, 1fr);
  }
}

.lp-sisyphus-services__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 1.35rem 1.25rem;
  border-radius: var(--lp-sis-radius);
  background: var(--lp-sis-surface);
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.06);
  color: inherit;
  min-height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lp-sisyphus-services__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  color: inherit;
}

.lp-sisyphus-services__card--featured {
  background: var(--lp-sis-accent);
  border-color: transparent;
  color: #fff;
}

.lp-sisyphus-services__card--featured .lp-sisyphus-services__desc,
.lp-sisyphus-services__card--featured .lp-sisyphus-services__link {
  color: rgba(255, 255, 255, 0.88);
}

.lp-sisyphus-services__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  font-size: 1.2rem;
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--lp-sis-accent);
}

.lp-sisyphus-services__card--featured .lp-sisyphus-services__icon {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.lp-sisyphus-services__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.lp-sisyphus-services__desc {
  margin: 0;
  flex: 1;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--lp-sis-muted);
}

.lp-sisyphus-services__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--lp-sis-accent);
}

/* Showcase */
.lp-sisyphus-showcase {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.lp-sisyphus-showcase__card {
  grid-column: span 4;
  border-radius: var(--lp-sis-radius);
  overflow: hidden;
  background: var(--lp-sis-muted-bg);
}

.lp-sisyphus-showcase__card--wide {
  grid-column: span 5;
}

@media (max-width: 991.98px) {
  .lp-sisyphus-showcase__card,
  .lp-sisyphus-showcase__card--wide {
    grid-column: span 6;
  }
}

@media (max-width: 575.98px) {
  .lp-sisyphus-showcase__card,
  .lp-sisyphus-showcase__card--wide {
    grid-column: span 12;
  }
}

.lp-sisyphus-showcase__frame {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.lp-sisyphus-showcase__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lp-sisyphus-showcase__meta {
  padding: 1rem 1.1rem 1.15rem;
}

.lp-sisyphus-showcase__meta h3 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 700;
}

.lp-sisyphus-showcase__meta p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--lp-sis-muted);
  line-height: 1.45;
}

/* Testimonials */
.lp-sisyphus-carousel-nav {
  display: flex;
  gap: 0.5rem;
}

.lp-sisyphus-carousel-nav__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.12);
  border-radius: 50%;
  background: var(--lp-sis-surface);
  color: inherit;
}

.lp-sisyphus-testimonials {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 991.98px) {
  .lp-sisyphus-testimonials {
    grid-template-columns: 1fr;
  }
}

.lp-sisyphus-testimonials__card {
  padding: 1.35rem 1.25rem;
  border-radius: var(--lp-sis-radius);
  background: var(--lp-sis-surface);
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.06);
}

.lp-sisyphus-testimonials__card--featured {
  background: var(--lp-sis-accent);
  border-color: transparent;
  color: #fff;
}

.lp-sisyphus-testimonials__card--featured .lp-sisyphus-testimonials__role,
.lp-sisyphus-testimonials__card--featured .lp-sisyphus-testimonials__quote {
  color: rgba(255, 255, 255, 0.9);
}

.lp-sisyphus-testimonials__profile {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.85rem;
}

.lp-sisyphus-testimonials__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(var(--bs-primary-rgb), 0.12);
  color: var(--lp-sis-accent);
}

.lp-sisyphus-testimonials__card--featured .lp-sisyphus-testimonials__avatar {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.lp-sisyphus-testimonials__name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
}

.lp-sisyphus-testimonials__role {
  margin: 0;
  font-size: 0.78rem;
  color: var(--lp-sis-muted);
}

.lp-sisyphus-testimonials__quote {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--lp-sis-ink);
}

/* Earn */
.lp-sisyphus-earn {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}

.lp-sisyphus-earn__card {
  padding: 1.35rem;
  border-radius: var(--lp-sis-radius);
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.08);
  background: var(--lp-sis-surface);
  color: inherit;
  transition: box-shadow 0.2s ease;
}

.lp-sisyphus-earn__card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  color: inherit;
}

.lp-sisyphus-earn__icon {
  font-size: 1.5rem;
  color: var(--lp-sis-accent);
  margin-bottom: 0.75rem;
}

.lp-sisyphus-earn__card h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 700;
}

.lp-sisyphus-earn__card p {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  color: var(--lp-sis-muted);
  line-height: 1.45;
}

.lp-sisyphus-earn__card span {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--lp-sis-accent);
}
</style>
