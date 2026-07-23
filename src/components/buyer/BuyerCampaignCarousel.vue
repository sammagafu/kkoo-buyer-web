<template>
  <section
    v-if="campaigns.length"
    ref="rootEl"
    class="buyer-promo-fs"
    aria-label="Promotions"
  >
    <div
      ref="trackEl"
      class="buyer-promo-fs__track"
      @scroll.passive="onScroll"
    >
      <article
        v-for="(camp, index) in campaigns"
        :key="camp.id"
        class="buyer-promo-fs__slide"
        :aria-hidden="index !== activeIndex"
      >
        <div class="buyer-promo-fs__media">
          <img
            v-if="campaignImageUrl(camp)"
            :src="campaignImageUrl(camp)"
            :alt="camp.title"
          />
          <div v-else class="buyer-promo-fs__fallback" aria-hidden="true" />
        </div>

        <div class="buyer-promo-fs__veil" aria-hidden="true" />

        <button
          type="button"
          class="buyer-promo-fs__dismiss"
          aria-label="Dismiss"
          @click="emit('dismiss', camp)"
        >
          <Icon icon="solar:close-circle-bold" />
        </button>

        <div class="buyer-promo-fs__copy">
          <p v-if="badgeText(camp)" class="buyer-promo-fs__badge" :data-badge="camp.badge || camp.action_type || 'promo'">
            {{ badgeText(camp) }}
          </p>
          <p v-if="camp.gift_label || camp.gift_voucher_id" class="buyer-promo-fs__gift">
            <Icon icon="solar:gift-bold" />
            {{ camp.gift_label || 'Gift inside' }}
          </p>
          <div
            v-if="isPreorderCampaign(camp) && daysLeft(camp) != null"
            class="buyer-promo-fs__countdown"
            :aria-label="`${daysLeft(camp)} days left`"
          >
            <span class="buyer-promo-fs__countdown-days">{{ daysLeft(camp) }}</span>
            <span class="buyer-promo-fs__countdown-label">{{ daysLeft(camp) === 1 ? 'day left' : 'days left' }}</span>
          </div>
          <h2 class="buyer-promo-fs__title">{{ camp.title }}</h2>
          <p v-if="camp.subtitle" class="buyer-promo-fs__meta">{{ camp.subtitle }}</p>
          <div
            v-if="slideProducts(camp).length"
            class="buyer-promo-fs__products"
            aria-label="Campaign products"
          >
            <RouterLink
              v-for="prod in slideProducts(camp)"
              :key="prod.id"
              class="buyer-promo-fs__product"
              :to="productThumbTo(prod)"
              :title="prod.title || undefined"
            >
              <img :src="prod.image" :alt="prod.title || 'Product'" loading="lazy" decoding="async" />
            </RouterLink>
          </div>
          <component
            :is="isExternal(camp) ? 'a' : 'router-link'"
            v-if="campaignCtaRoute(camp)"
            :href="isExternal(camp) ? String(campaignCtaRoute(camp)) : undefined"
            :to="isExternal(camp) ? undefined : (campaignCtaRoute(camp) as RouteLocationRaw)"
            class="buyer-promo-fs__cta"
            :target="isExternal(camp) ? '_blank' : undefined"
            :rel="isExternal(camp) ? 'noopener' : undefined"
          >
            <span>{{ camp.cta_label || 'View' }}</span>
            <Icon icon="solar:alt-arrow-right-linear" />
          </component>
        </div>
      </article>
    </div>

    <div v-if="campaigns.length > 1" class="buyer-promo-fs__dots" role="tablist" aria-label="Slides">
      <button
        v-for="(camp, index) in campaigns"
        :key="`dot-${camp.id}`"
        type="button"
        class="buyer-promo-fs__dot"
        :class="{ 'is-active': index === activeIndex }"
        role="tab"
        :aria-selected="index === activeIndex"
        :aria-label="`Slide ${index + 1}`"
        @click="goTo(index)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { BuyerCampaign } from '@/api/campaigns'
import { campaignCtaRoute, campaignImageUrl, campaignProductThumbs } from '@/composables/useBuyerCampaigns'
import { daysUntil, isPreorderCampaign } from '@/utils/preorderCountdown'

const props = defineProps<{
  campaigns: BuyerCampaign[]
}>()

const emit = defineEmits<{
  dismiss: [campaign: BuyerCampaign]
}>()

const rootEl = ref<HTMLElement | null>(null)
const trackEl = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const nowMs = ref(Date.now())
let autoTimer: ReturnType<typeof setInterval> | null = null
let tickTimer: ReturnType<typeof setInterval> | null = null

function isExternal(camp: BuyerCampaign) {
  return typeof campaignCtaRoute(camp) === 'string'
}

function productThumbTo(prod: { id: number; slug: string }): RouteLocationRaw {
  if (prod.slug) return { name: 'buyer.product.slug', params: { slug: prod.slug } }
  return { name: 'buyer.product', params: { id: String(prod.id) } }
}

function slideProducts(camp: BuyerCampaign) {
  return campaignProductThumbs(camp)
}

function daysLeft(camp: BuyerCampaign) {
  return daysUntil(camp.end_at, nowMs.value)
}

const BADGE_FALLBACK: Record<string, string> = {
  preorder: 'Preorder',
  limited: 'Limited offer',
  limited_offer: 'Limited offer',
  flash: 'Flash',
  new: 'New item',
  new_item: 'New item',
  trending: 'Trending',
  gift: 'Gift',
  sale: 'Sale',
  hot: 'Hot',
  exclusive: 'Exclusive',
  clearance: 'Clearance',
}

function badgeText(camp: BuyerCampaign) {
  const labeled = String(camp.badge_label ?? '').trim()
  if (labeled) return labeled
  const key = String(camp.badge ?? camp.action_type ?? '').trim().toLowerCase()
  if (!key) return ''
  return BADGE_FALLBACK[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function goTo(index: number) {
  const track = trackEl.value
  if (!track) return
  const width = track.clientWidth
  track.scrollTo({ left: width * index, behavior: 'smooth' })
  activeIndex.value = index
  restartAuto()
}

function onScroll() {
  const track = trackEl.value
  if (!track || !track.clientWidth) return
  activeIndex.value = Math.round(track.scrollLeft / track.clientWidth)
}

function restartAuto() {
  if (autoTimer) clearInterval(autoTimer)
  if (props.campaigns.length < 2) return
  autoTimer = setInterval(() => {
    const next = (activeIndex.value + 1) % props.campaigns.length
    goTo(next)
  }, 6500)
}

onMounted(() => {
  restartAuto()
  tickTimer = setInterval(() => {
    nowMs.value = Date.now()
  }, 60_000)
})

watch(
  () => props.campaigns.length,
  () => restartAuto(),
)

onBeforeUnmount(() => {
  if (autoTimer) clearInterval(autoTimer)
  if (tickTimer) clearInterval(tickTimer)
})
</script>

<style scoped>
.buyer-promo-fs {
  --buyer-promo-fs-radius: 0;
  /* Text stays light over photo in both themes; veil provides contrast */
  --buyer-promo-fs-ink: #ffffff;
  --buyer-promo-fs-ink-muted: rgba(255, 255, 255, 0.92);
  --buyer-promo-fs-accent: #f7c948;
  position: relative;
  /* Break out of main padding for true full-bleed in the shopping shell */
  width: calc(100% + 2.2rem);
  margin-left: -1.1rem;
  margin-right: -1.1rem;
  margin-bottom: 0.5rem;
  border-radius: var(--buyer-promo-fs-radius);
  overflow: hidden;
  background: #100c14;
  color: var(--buyer-promo-fs-ink);
  min-height: min(100dvh, 56rem);
  height: min(100dvh, 56rem);
}

@media (min-width: 768px) {
  .buyer-promo-fs {
    width: calc(100% + 3.3rem);
    margin-left: -1.65rem;
    margin-right: -1.65rem;
  }
}

@media (min-width: 992px) {
  .buyer-promo-fs {
    width: calc(100% + 3.7rem);
    margin-left: -1.85rem;
    margin-right: -1.85rem;
    --buyer-promo-fs-radius: 1.25rem;
    min-height: min(78dvh, 42rem);
    height: min(78dvh, 42rem);
  }
}

.buyer-promo-fs__track {
  display: flex;
  height: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.buyer-promo-fs__track::-webkit-scrollbar {
  display: none;
}

.buyer-promo-fs__slide {
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.buyer-promo-fs__media,
.buyer-promo-fs__fallback {
  position: absolute;
  inset: 0;
}

.buyer-promo-fs__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.buyer-promo-fs__fallback {
  background:
    radial-gradient(ellipse at 20% 10%, rgba(255, 120, 40, 0.35), transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(90, 40, 160, 0.45), transparent 45%),
    linear-gradient(160deg, #1a1224 0%, #100c14 55%, #2a1830 100%);
}

.buyer-promo-fs__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(8, 6, 12, 0.28) 0%, rgba(8, 6, 12, 0.18) 36%, rgba(8, 6, 12, 0.55) 62%, rgba(8, 6, 12, 0.92) 100%),
    linear-gradient(90deg, rgba(8, 6, 12, 0.35) 0%, transparent 42%);
  pointer-events: none;
}

.buyer-promo-fs__dismiss {
  position: absolute;
  top: max(0.85rem, env(safe-area-inset-top));
  right: 0.85rem;
  z-index: 3;
  border: none;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
}

.buyer-promo-fs__copy {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 1.5rem 1.25rem max(5.5rem, calc(env(safe-area-inset-bottom) + 4.5rem));
  max-width: 40rem;
  color: var(--buyer-promo-fs-ink);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.buyer-promo-fs__copy::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: -2.5rem;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, rgba(8, 6, 12, 0.55) 42%, rgba(8, 6, 12, 0.78) 100%);
}

@media (min-width: 992px) {
  .buyer-promo-fs__copy {
    padding: 2rem 2rem 2.5rem;
  }
}

.buyer-promo-fs__gift {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--buyer-promo-fs-accent);
}

.buyer-promo-fs__badge {
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0.35rem 0.7rem;
  border-radius: 0.4rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.28);
}

.buyer-promo-fs__badge[data-badge='preorder'] {
  background: color-mix(in srgb, var(--kkoo-primary, #6b2fd6) 72%, #000);
  border-color: transparent;
}

.buyer-promo-fs__badge[data-badge='flash'],
.buyer-promo-fs__badge[data-badge='hot'] {
  background: #e85d04;
  border-color: transparent;
}

.buyer-promo-fs__badge[data-badge='limited'],
.buyer-promo-fs__badge[data-badge='limited_offer'] {
  background: #b45309;
  border-color: transparent;
}

.buyer-promo-fs__badge[data-badge='new'],
.buyer-promo-fs__badge[data-badge='new_item'] {
  background: #0f766e;
  border-color: transparent;
}

.buyer-promo-fs__badge[data-badge='trending'] {
  background: #7c3aed;
  border-color: transparent;
}

.buyer-promo-fs__badge[data-badge='gift'] {
  background: #ca8a04;
  border-color: transparent;
  color: #1a1200;
}

.buyer-promo-fs__badge[data-badge='sale'],
.buyer-promo-fs__badge[data-badge='clearance'] {
  background: #be123c;
  border-color: transparent;
}

.buyer-promo-fs__badge[data-badge='exclusive'] {
  background: #1e3a5f;
  border-color: transparent;
}

.buyer-promo-fs__title {
  margin: 0;
  font-size: clamp(1.75rem, 6vw, 3rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-wrap: balance;
  color: var(--buyer-promo-fs-ink);
}

.buyer-promo-fs__meta {
  margin: 0;
  font-size: clamp(0.95rem, 2.4vw, 1.15rem);
  line-height: 1.45;
  max-width: 32rem;
  color: var(--buyer-promo-fs-ink-muted);
}

.buyer-promo-fs__countdown {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  margin: 0.15rem 0 0.35rem;
  line-height: 1;
}

.buyer-promo-fs__countdown-days {
  font-size: clamp(4.5rem, 22vw, 9rem);
  font-weight: 900;
  letter-spacing: -0.06em;
  line-height: 0.88;
  color: var(--buyer-promo-fs-accent);
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
  font-variant-numeric: tabular-nums;
}

.buyer-promo-fs__countdown-label {
  font-size: clamp(0.85rem, 2.4vw, 1.15rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--buyer-promo-fs-ink-muted);
}

.buyer-promo-fs__products {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.55rem;
  max-width: 100%;
  overflow-x: auto;
  padding: 0.15rem 0.1rem 0.25rem;
  margin-top: 0.15rem;
  scrollbar-width: none;
}

.buyer-promo-fs__products::-webkit-scrollbar {
  display: none;
}

.buyer-promo-fs__product {
  flex: 0 0 auto;
  width: 3.35rem;
  height: 3.35rem;
  border-radius: 0.7rem;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
  background: rgba(0, 0, 0, 0.25);
}

.buyer-promo-fs__product img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.buyer-promo-fs__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.55rem;
  padding: 0.85rem 1.35rem;
  border-radius: 0.85rem;
  background: var(--kkoo-primary, #6b2fd6);
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: transform 0.18s ease, filter 0.18s ease;
}

.buyer-promo-fs__cta:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
  color: #fff;
}

.buyer-promo-fs__dots {
  position: absolute;
  left: 50%;
  bottom: max(1.15rem, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 0.4rem;
  padding: 0.35rem 0.5rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
}

@media (min-width: 992px) {
  .buyer-promo-fs__dots {
    bottom: 1.35rem;
  }
}

.buyer-promo-fs__dot {
  width: 0.45rem;
  height: 0.45rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: width 0.2s ease, background 0.2s ease;
}

.buyer-promo-fs__dot.is-active {
  width: 1.35rem;
  background: #fff;
}
</style>
