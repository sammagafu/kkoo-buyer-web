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
          <div class="buyer-promo-fs__topline">
            <p v-if="badgeText(camp)" class="buyer-promo-fs__badge" :data-badge="camp.badge || camp.action_type || 'promo'">
              {{ badgeText(camp) }}
            </p>
            <div
              v-if="isPreorderCampaign(camp) && daysLeft(camp) != null"
              class="buyer-promo-fs__countdown"
              :aria-label="`${daysLeft(camp)} days left`"
            >
              <span class="buyer-promo-fs__countdown-days">{{ daysLeft(camp) }}</span>
              <span class="buyer-promo-fs__countdown-label">{{ daysLeft(camp) === 1 ? 'day left' : 'days left' }}</span>
            </div>
            <p v-if="camp.gift_label || camp.gift_voucher_id" class="buyer-promo-fs__gift">
              <Icon icon="solar:gift-bold" />
              {{ camp.gift_label || 'Gift inside' }}
            </p>
          </div>
          <h2 class="buyer-promo-fs__title">{{ camp.title }}</h2>
          <p v-if="camp.subtitle" class="buyer-promo-fs__meta">{{ camp.subtitle }}</p>
          <div
            v-if="slideProducts(camp).length || campaignCtaRoute(camp)"
            class="buyer-promo-fs__actions"
          >
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
              :class="{ 'buyer-promo-fs__cta--preorder': isPreorderCampaign(camp) }"
              :target="isExternal(camp) ? '_blank' : undefined"
              :rel="isExternal(camp) ? 'noopener' : undefined"
            >
              <span>{{ camp.cta_label || 'View' }}</span>
              <Icon icon="solar:arrow-right-linear" />
            </component>
          </div>
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
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { BuyerCampaign } from '@/api/campaigns'
import { campaignCtaRoute, campaignImageUrl, campaignProductThumbs } from '@/composables/useBuyerCampaigns'
import { daysUntil, isPreorderCampaign } from '@/utils/preorderCountdown'

const props = defineProps<{
  campaigns: BuyerCampaign[]
  trackImpression?: (id?: number) => void
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
  const width = track.clientWidth || 1
  track.scrollTo({ left: width * index, behavior: 'smooth' })
  activeIndex.value = index
  restartAuto()
}

function onScroll() {
  const track = trackEl.value
  if (!track) return
  const width = track.clientWidth || 1
  activeIndex.value = Math.round(track.scrollLeft / width)
}

function recordActiveImpression() {
  const camp = props.campaigns[activeIndex.value]
  props.trackImpression?.(camp?.id)
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
  void nextTick(() => {
    goTo(0)
    recordActiveImpression()
  })
  restartAuto()
  tickTimer = setInterval(() => {
    nowMs.value = Date.now()
  }, 60_000)
})

watch(
  () => props.campaigns.length,
  () => {
    activeIndex.value = 0
    void nextTick(() => {
      goTo(0)
      recordActiveImpression()
    })
    restartAuto()
  },
)

watch(activeIndex, () => {
  recordActiveImpression()
})

onBeforeUnmount(() => {
  if (autoTimer) clearInterval(autoTimer)
  if (tickTimer) clearInterval(tickTimer)
})
</script>

<style scoped>
.buyer-promo-fs {
  --buyer-promo-fs-radius: 1rem;
  --buyer-promo-fs-ink: #ffffff;
  --buyer-promo-fs-ink-muted: rgba(255, 255, 255, 0.88);
  --buyer-promo-fs-accent: #f7a829;
  position: relative;
  width: auto;
  margin: 0 0 0.85rem;
  border-radius: var(--buyer-promo-fs-radius);
  overflow: hidden;
  background: #100c14;
  color: var(--buyer-promo-fs-ink);
  aspect-ratio: 4 / 5;
  max-height: min(68dvh, 26rem);
  min-height: 14rem;
}

/* Whole selector must be :global — Vue scoped drops the child after a partial :global(). */
:global(.buyer-xp--mhome > .buyer-promo-fs) {
  margin-left: var(--buyer-page-inset-x, 1rem);
  margin-right: var(--buyer-page-inset-x, 1rem);
  max-height: min(56dvh, 24rem);
}

@media (min-width: 768px) {
  .buyer-promo-fs {
    aspect-ratio: 21 / 9;
    max-height: min(46dvh, 24rem);
    min-height: 17.5rem;
    --buyer-promo-fs-radius: 1.15rem;
  }
}

@media (min-width: 992px) {
  .buyer-promo-fs {
    width: calc(100% + 3.7rem);
    margin-left: -1.85rem;
    margin-right: -1.85rem;
    margin-bottom: 0.75rem;
    --buyer-promo-fs-radius: 1.25rem;
    aspect-ratio: 2.35 / 1;
    max-height: 22rem;
    min-height: 18.5rem;
  }

  :global(.buyer-xp--mhome > .buyer-promo-fs) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    max-height: 22rem;
  }
}

.buyer-promo-fs__track {
  display: flex;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
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
    linear-gradient(180deg, rgba(8, 6, 12, 0.2) 0%, rgba(8, 6, 12, 0.15) 40%, rgba(8, 6, 12, 0.72) 78%, rgba(8, 6, 12, 0.92) 100%),
    linear-gradient(90deg, rgba(8, 6, 12, 0.55) 0%, rgba(8, 6, 12, 0.2) 48%, transparent 70%);
  pointer-events: none;
}

.buyer-promo-fs__dismiss {
  position: absolute;
  top: max(0.85rem, calc(env(safe-area-inset-top, 0px) + 0.55rem));
  right: 0.85rem;
  z-index: 3;
  box-sizing: border-box;
  border: none;
  background: rgba(0, 0, 0, 0.48);
  color: #fff;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-tap-highlight-color: transparent;
}

.buyer-promo-fs__dismiss :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 768px) {
  .buyer-promo-fs__dismiss {
    top: 1rem;
    right: 1rem;
  }
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
  justify-content: flex-end;
  gap: 0.55rem;
  padding: 1.15rem 1rem max(3.25rem, calc(env(safe-area-inset-bottom, 0px) + 2.5rem));
  padding-right: 3.25rem; /* clear dismiss control */
  max-width: min(100%, 36rem);
  color: var(--buyer-promo-fs-ink);
}

@media (min-width: 768px) {
  .buyer-promo-fs__copy {
    padding: 1.35rem 3.5rem 1.5rem 1.6rem; /* right clears dismiss */
    max-width: min(100%, 36rem);
    gap: 0.5rem;
  }
}

@media (min-width: 992px) {
  .buyer-promo-fs__copy {
    padding: 1.5rem 3.75rem 1.65rem 1.85rem;
    max-width: min(56%, 34rem);
  }
}

.buyer-promo-fs__topline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.buyer-promo-fs__gift {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #1a1200;
  background: color-mix(in srgb, var(--buyer-promo-fs-accent) 88%, #fff);
}

.buyer-promo-fs__badge {
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.buyer-promo-fs__badge[data-badge='preorder'] {
  background: #5c308f;
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

.buyer-promo-fs__countdown {
  display: inline-flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.35rem;
  margin: 0;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(247, 168, 41, 0.45);
  backdrop-filter: blur(6px);
  line-height: 1;
}

.buyer-promo-fs__countdown-days {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--buyer-promo-fs-accent);
  font-variant-numeric: tabular-nums;
}

.buyer-promo-fs__countdown-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.buyer-promo-fs__title {
  margin: 0;
  font-family: var(--kkoo-font-display, 'Poppins', sans-serif);
  font-size: clamp(1.3rem, 2.8vw, 2rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.03em;
  text-wrap: balance;
  color: var(--buyer-promo-fs-ink);
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
}

.buyer-promo-fs__meta {
  margin: 0;
  font-size: clamp(0.86rem, 1.35vw, 0.98rem);
  line-height: 1.4;
  max-width: 38ch;
  color: var(--buyer-promo-fs-ink-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.buyer-promo-fs__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.15rem;
  width: 100%;
}

.buyer-promo-fs__products {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.4rem;
  max-width: 100%;
  overflow-x: auto;
  padding: 0;
  scrollbar-width: none;
}

.buyer-promo-fs__products::-webkit-scrollbar {
  display: none;
}

.buyer-promo-fs__product {
  flex: 0 0 auto;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.6rem;
  overflow: hidden;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
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
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0;
  min-height: 2.55rem;
  padding: 0.65rem 1.15rem;
  border-radius: 0.8rem;
  background: #5c308f;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1;
  text-decoration: none;
  border: none;
  box-shadow: 0 8px 20px rgba(92, 48, 143, 0.35);
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.buyer-promo-fs__cta span {
  white-space: nowrap;
}

.buyer-promo-fs__cta :deep(svg) {
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
}

.buyer-promo-fs__cta--preorder {
  background: #f7a829;
  color: #1a1200;
  box-shadow: 0 8px 20px rgba(247, 168, 41, 0.32);
}

.buyer-promo-fs__cta:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
  color: inherit;
}

.buyer-promo-fs__cta--preorder:hover {
  color: #1a1200;
}

.buyer-promo-fs__dots {
  position: absolute;
  left: 50%;
  bottom: max(0.85rem, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 0.35rem;
  padding: 0.3rem 0.45rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
}

@media (min-width: 768px) {
  .buyer-promo-fs__dots {
    bottom: 0.95rem;
    left: auto;
    right: 1.25rem;
    transform: none;
  }
}

.buyer-promo-fs__dot {
  width: 0.4rem;
  height: 0.4rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: width 0.2s ease, background 0.2s ease;
}

.buyer-promo-fs__dot.is-active {
  width: 1.2rem;
  background: #fff;
}
</style>
