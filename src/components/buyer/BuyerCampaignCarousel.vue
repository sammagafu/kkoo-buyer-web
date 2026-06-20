<template>
  <section v-if="campaigns.length" class="buyer-promo-carousel" aria-label="Promotions">
    <div class="buyer-promo-carousel__track">
      <article
        v-for="camp in campaigns"
        :key="camp.id"
        class="buyer-promo-carousel__slide"
      >
        <button type="button" class="buyer-promo-carousel__dismiss" aria-label="Dismiss" @click="emit('dismiss', camp)">
          <Icon icon="solar:close-circle-bold" />
        </button>
        <div v-if="campaignImageUrl(camp)" class="buyer-promo-carousel__banner">
          <img :src="campaignImageUrl(camp)" :alt="camp.title" />
          <div class="buyer-promo-carousel__overlay">
            <p v-if="camp.gift_label || camp.gift_voucher_id" class="buyer-promo-carousel__gift">
              <Icon icon="solar:gift-bold" />
              {{ camp.gift_label || 'Gift inside' }}
            </p>
            <h3 class="buyer-promo-carousel__title">{{ camp.title }}</h3>
            <p v-if="camp.subtitle" class="buyer-promo-carousel__meta">{{ camp.subtitle }}</p>
            <component
              :is="isExternal(camp) ? 'a' : 'router-link'"
              v-if="campaignCtaRoute(camp)"
              :href="isExternal(camp) ? String(campaignCtaRoute(camp)) : undefined"
              :to="isExternal(camp) ? undefined : (campaignCtaRoute(camp) as RouteLocationRaw)"
              class="buyer-venue__chip buyer-venue__chip--primary buyer-promo-carousel__cta"
              :target="isExternal(camp) ? '_blank' : undefined"
              :rel="isExternal(camp) ? 'noopener' : undefined"
            >
              {{ camp.cta_label || 'View' }}
            </component>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { BuyerCampaign } from '@/api/campaigns'
import { campaignCtaRoute, campaignImageUrl } from '@/composables/useBuyerCampaigns'

defineProps<{
  campaigns: BuyerCampaign[]
}>()

const emit = defineEmits<{
  dismiss: [campaign: BuyerCampaign]
}>()

function isExternal(camp: BuyerCampaign) {
  return typeof campaignCtaRoute(camp) === 'string'
}
</script>

<style scoped>
.buyer-promo-carousel {
  margin-bottom: 0.75rem;
}

.buyer-promo-carousel__track {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.25rem;
}

.buyer-promo-carousel__slide {
  position: relative;
  flex: 0 0 min(92%, 28rem);
  scroll-snap-align: start;
  border-radius: 1rem;
  overflow: hidden;
}

.buyer-promo-carousel__banner {
  position: relative;
  aspect-ratio: 1920 / 786;
  background: var(--buyer-chip-bg);
}

.buyer-promo-carousel__banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.buyer-promo-carousel__overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 0.75rem 0.85rem;
  background: linear-gradient(180deg, transparent 0%, rgba(16, 12, 20, 0.82) 100%);
  color: #fff;
}

.buyer-promo-carousel__dismiss {
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;
  z-index: 2;
  border: none;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  border-radius: 50%;
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.buyer-promo-carousel__gift {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #f7c948;
}

.buyer-promo-carousel__title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
}

.buyer-promo-carousel__meta {
  margin: 0.25rem 0 0;
  font-size: 0.78rem;
  opacity: 0.9;
}

.buyer-promo-carousel__cta {
  margin-top: 0.55rem;
}
</style>
