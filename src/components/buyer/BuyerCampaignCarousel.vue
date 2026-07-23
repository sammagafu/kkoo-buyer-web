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
          <h2 class="buyer-promo-fs__title">{{ camp.title }}</h2>
          <p v-if="camp.subtitle" class="buyer-promo-fs__meta">{{ camp.subtitle }}</p>
          <p
            v-if="camp.action_type === 'preorder' && camp.remaining_stock != null"
            class="buyer-promo-fs__stock"
          >
            {{ formatRemaining(camp.remaining_stock) }}
          </p>
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
import { campaignCtaRoute, campaignImageUrl } from '@/composables/useBuyerCampaigns'

const props = defineProps<{
  campaigns: BuyerCampaign[]
}>()

const emit = defineEmits<{
  dismiss: [campaign: BuyerCampaign]
}>()

const rootEl = ref<HTMLElement | null>(null)
const trackEl = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
let autoTimer: ReturnType<typeof setInterval> | null = null

function isExternal(camp: BuyerCampaign) {
  return typeof campaignCtaRoute(camp) === 'string'
}

function formatRemaining(n: number) {
  return `${new Intl.NumberFormat().format(n)} left`
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
})

watch(
  () => props.campaigns.length,
  () => restartAuto(),
)

onBeforeUnmount(() => {
  if (autoTimer) clearInterval(autoTimer)
})
</script>

<style scoped>
.buyer-promo-fs {
  --buyer-promo-fs-radius: 0;
  position: relative;
  /* Break out of main padding for true full-bleed in the shopping shell */
  width: calc(100% + 2.2rem);
  margin-left: -1.1rem;
  margin-right: -1.1rem;
  margin-bottom: 0.5rem;
  border-radius: var(--buyer-promo-fs-radius);
  overflow: hidden;
  background: #100c14;
  color: #fff;
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
    linear-gradient(180deg, rgba(16, 12, 20, 0.15) 0%, rgba(16, 12, 20, 0.2) 40%, rgba(16, 12, 20, 0.88) 100%);
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
  color: #f7c948;
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
}

.buyer-promo-fs__meta {
  margin: 0;
  font-size: clamp(0.95rem, 2.4vw, 1.15rem);
  line-height: 1.45;
  opacity: 0.92;
  max-width: 32rem;
}

.buyer-promo-fs__stock {
  margin: 0.15rem 0 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: #f7c948;
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
