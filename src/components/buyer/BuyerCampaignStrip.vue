<template>
  <section
    v-if="campaigns.length"
    class="buyer-promo-strip"
    aria-label="Promo banners"
  >
    <div
      ref="trackEl"
      class="buyer-promo-strip__track"
      @scroll.passive="onScroll"
    >
      <article
        v-for="(camp, index) in campaigns"
        :key="camp.id"
        class="buyer-promo-strip__slide"
        :aria-hidden="index !== activeIndex"
      >
        <div class="buyer-promo-strip__media">
          <img
            v-if="campaignImageUrl(camp)"
            :src="campaignImageUrl(camp)"
            :alt="camp.title"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="buyer-promo-strip__fallback" aria-hidden="true" />
        </div>

        <div class="buyer-promo-strip__veil" aria-hidden="true" />

        <button
          type="button"
          class="buyer-promo-strip__dismiss"
          aria-label="Dismiss"
          @click="emit('dismiss', camp)"
        >
          <Icon icon="solar:close-circle-bold" />
        </button>

        <div class="buyer-promo-strip__copy">
          <p
            v-if="badgeText(camp)"
            class="buyer-promo-strip__badge"
            :data-badge="camp.badge || camp.action_type || 'promo'"
          >
            {{ badgeText(camp) }}
          </p>
          <div class="buyer-promo-strip__text">
            <div
              v-if="isPreorderCampaign(camp) && daysLeft(camp) != null"
              class="buyer-promo-strip__countdown"
              :aria-label="`${daysLeft(camp)} days left`"
            >
              <span class="buyer-promo-strip__countdown-days">{{ daysLeft(camp) }}</span>
              <span class="buyer-promo-strip__countdown-label">{{ daysLeft(camp) === 1 ? 'day left' : 'days left' }}</span>
            </div>
            <h2 class="buyer-promo-strip__title">{{ camp.title }}</h2>
            <p v-if="camp.subtitle" class="buyer-promo-strip__meta">{{ camp.subtitle }}</p>
          </div>
          <component
            :is="isExternal(camp) ? 'a' : 'router-link'"
            v-if="campaignCtaRoute(camp)"
            :href="isExternal(camp) ? String(campaignCtaRoute(camp)) : undefined"
            :to="isExternal(camp) ? undefined : (campaignCtaRoute(camp) as RouteLocationRaw)"
            class="buyer-promo-strip__cta"
            :target="isExternal(camp) ? '_blank' : undefined"
            :rel="isExternal(camp) ? 'noopener' : undefined"
          >
            <span>{{ camp.cta_label || 'View' }}</span>
            <Icon icon="solar:alt-arrow-right-linear" />
          </component>
        </div>
      </article>
    </div>

    <div v-if="campaigns.length > 1" class="buyer-promo-strip__dots" role="tablist" aria-label="Promo slides">
      <button
        v-for="(camp, index) in campaigns"
        :key="`dot-${camp.id}`"
        type="button"
        class="buyer-promo-strip__dot"
        :class="{ 'is-active': index === activeIndex }"
        role="tab"
        :aria-selected="index === activeIndex"
        :aria-label="`Banner ${index + 1}`"
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
import { campaignCtaRoute, campaignImageUrl } from '@/composables/useBuyerCampaigns'
import { daysUntil, isPreorderCampaign } from '@/utils/preorderCountdown'

const props = defineProps<{
  campaigns: BuyerCampaign[]
  trackImpression?: (id?: number) => void
}>()

const emit = defineEmits<{
  dismiss: [campaign: BuyerCampaign]
}>()

const trackEl = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const nowMs = ref(Date.now())
let autoTimer: ReturnType<typeof setInterval> | null = null
let tickTimer: ReturnType<typeof setInterval> | null = null

const BADGE_LABELS: Record<string, string> = {
  preorder: 'Preorder',
  limited: 'Limited offer',
  flash: 'Flash',
  new: 'New item',
  trending: 'Trending',
  gift: 'Gift',
  sale: 'Sale',
  hot: 'Hot',
  exclusive: 'Exclusive',
  clearance: 'Clearance',
}

function badgeText(camp: BuyerCampaign) {
  if (camp.badge_label) return camp.badge_label
  const key = String(camp.badge || camp.action_type || '').toLowerCase()
  return BADGE_LABELS[key] || ''
}

function daysLeft(camp: BuyerCampaign) {
  return daysUntil(camp.end_at, nowMs.value)
}

function isExternal(camp: BuyerCampaign) {
  return Boolean(String(camp.cta_external_url ?? '').trim())
}

function recordActiveImpression() {
  const camp = props.campaigns[activeIndex.value]
  props.trackImpression?.(camp?.id)
}

function goTo(index: number) {
  const el = trackEl.value
  if (!el) return
  const width = el.clientWidth || 1
  el.scrollTo({ left: width * index, behavior: 'smooth' })
  activeIndex.value = index
}

function onScroll() {
  const el = trackEl.value
  if (!el) return
  const width = el.clientWidth || 1
  activeIndex.value = Math.round(el.scrollLeft / width)
}

function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}

function startAuto() {
  stopAuto()
  if (props.campaigns.length < 2) return
  autoTimer = setInterval(() => {
    const next = (activeIndex.value + 1) % props.campaigns.length
    goTo(next)
  }, 5500)
}

onMounted(() => {
  void nextTick(recordActiveImpression)
  startAuto()
  tickTimer = setInterval(() => {
    nowMs.value = Date.now()
  }, 60_000)
})
onBeforeUnmount(() => {
  stopAuto()
  if (tickTimer) clearInterval(tickTimer)
})
watch(
  () => props.campaigns.length,
  () => {
    activeIndex.value = 0
    void nextTick(recordActiveImpression)
    startAuto()
  },
)
watch(activeIndex, () => {
  recordActiveImpression()
})
</script>

<style scoped>
.buyer-promo-strip {
  --buyer-promo-strip-radius: 0.85rem;
  position: relative;
  width: 100%;
  margin: 0 0 0.85rem;
  border-radius: var(--buyer-promo-strip-radius);
  overflow: hidden;
  background: #16121c;
  color: #fff;
  aspect-ratio: 1920 / 786;
  max-height: 14rem;
}

@media (min-width: 768px) {
  .buyer-promo-strip {
    max-height: 16rem;
    --buyer-promo-strip-radius: 1rem;
  }
}

@media (min-width: 992px) {
  .buyer-promo-strip {
    max-height: 18rem;
  }
}

.buyer-promo-strip__track {
  display: flex;
  height: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.buyer-promo-strip__track::-webkit-scrollbar {
  display: none;
}

.buyer-promo-strip__slide {
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.buyer-promo-strip__media,
.buyer-promo-strip__fallback {
  position: absolute;
  inset: 0;
}

.buyer-promo-strip__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.buyer-promo-strip__fallback {
  background:
    radial-gradient(ellipse at 15% 20%, rgba(247, 168, 41, 0.35), transparent 50%),
    linear-gradient(120deg, #1a1224 0%, #2a1830 55%, #100c14 100%);
}

.buyer-promo-strip__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(8, 6, 12, 0.78) 0%, rgba(8, 6, 12, 0.35) 48%, rgba(8, 6, 12, 0.15) 100%),
    linear-gradient(180deg, transparent 40%, rgba(8, 6, 12, 0.45) 100%);
  pointer-events: none;
}

.buyer-promo-strip__dismiss {
  position: absolute;
  top: 0.55rem;
  right: 0.55rem;
  z-index: 3;
  border: none;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  font-size: 1.15rem;
}

.buyer-promo-strip__copy {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 0.45rem;
  padding: 0.85rem 1rem 1rem;
  max-width: min(100%, 28rem);
}

.buyer-promo-strip__badge {
  margin: 0;
  display: inline-flex;
  align-items: center;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(247, 201, 72, 0.95);
  color: #1a1208;
}

.buyer-promo-strip__title {
  margin: 0;
  font-size: clamp(1rem, 2.6vw, 1.35rem);
  font-weight: 800;
  line-height: 1.15;
  text-wrap: balance;
}

.buyer-promo-strip__countdown {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  margin: 0 0 0.2rem;
  line-height: 1;
}

.buyer-promo-strip__countdown-days {
  font-size: clamp(2.75rem, 9vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.9;
  color: #f7c948;
  font-variant-numeric: tabular-nums;
}

.buyer-promo-strip__countdown-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.88);
}

.buyer-promo-strip__meta {
  margin: 0.15rem 0 0;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.9);
}

.buyer-promo-strip__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.15rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: #fff;
  color: #140f1a;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
}

.buyer-promo-strip__dots {
  position: absolute;
  left: 50%;
  bottom: 0.45rem;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 0.35rem;
}

.buyer-promo-strip__dot {
  width: 0.4rem;
  height: 0.4rem;
  border: none;
  border-radius: 999px;
  padding: 0;
  background: rgba(255, 255, 255, 0.4);
}

.buyer-promo-strip__dot.is-active {
  background: #fff;
  width: 0.85rem;
}
</style>
