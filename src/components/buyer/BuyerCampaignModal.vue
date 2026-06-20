<template>
  <Teleport to="body">
    <Transition name="buyer-promo-modal">
      <div v-if="campaign" class="buyer-promo-modal" role="presentation" @click.self="onDismiss">
        <article class="buyer-promo-modal__card" role="dialog" aria-modal="true" :aria-label="campaign.title">
          <button type="button" class="buyer-promo-modal__close" aria-label="Close" @click="onDismiss">
            <Icon icon="solar:close-circle-linear" />
          </button>

          <div class="buyer-promo-modal__content">
            <h2 class="buyer-promo-modal__title">{{ campaign.title }}</h2>

            <div v-if="imageUrl" class="buyer-promo-modal__media">
              <img :src="imageUrl" :alt="campaign.title" />
            </div>

            <p v-if="campaign.gift_label || campaign.gift_voucher_id" class="buyer-promo-modal__gift">
              <Icon icon="solar:gift-bold" />
              {{ campaign.gift_label || 'Special gift for you' }}
            </p>

            <p v-if="campaign.subtitle" class="buyer-promo-modal__meta">{{ campaign.subtitle }}</p>

            <div class="buyer-promo-modal__actions">
              <component
                :is="ctaIsExternal ? 'a' : 'router-link'"
                v-if="ctaTarget"
                :href="ctaIsExternal ? String(ctaTarget) : undefined"
                :to="ctaIsExternal ? undefined : (ctaTarget as RouteLocationRaw)"
                class="buyer-promo-modal__cta"
                :target="ctaIsExternal ? '_blank' : undefined"
                :rel="ctaIsExternal ? 'noopener' : undefined"
                @click="onDismiss"
              >
                <span>{{ campaign.cta_label || 'View offer' }}</span>
                <Icon icon="solar:alt-arrow-right-linear" />
              </component>
              <button v-else type="button" class="buyer-promo-modal__cta" @click="onDismiss">
                <span>{{ campaign.cta_label || 'Got it' }}</span>
                <Icon icon="solar:alt-arrow-right-linear" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { BuyerCampaign } from '@/api/campaigns'
import { campaignCtaRoute, campaignImageUrl } from '@/composables/useBuyerCampaigns'

const props = defineProps<{
  campaign: BuyerCampaign | null
}>()

const emit = defineEmits<{
  dismiss: []
}>()

const imageUrl = computed(() => campaignImageUrl(props.campaign))
const ctaTarget = computed(() => campaignCtaRoute(props.campaign))
const ctaIsExternal = computed(() => typeof ctaTarget.value === 'string')

function onDismiss() {
  emit('dismiss')
}
</script>

<style scoped>
.buyer-promo-modal {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(16, 12, 20, 0.52);
  backdrop-filter: blur(3px);
}

.buyer-promo-modal__card {
  position: relative;
  width: min(100%, 22.5rem);
  aspect-ratio: 1080 / 1350;
  max-height: min(92vh, 40rem);
  border-radius: 1.35rem;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
  color: #1a1410;
}

.buyer-promo-modal__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 2.35rem 1.25rem 1.35rem;
  text-align: center;
}

.buyer-promo-modal__close {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  z-index: 2;
  border: none;
  background: transparent;
  color: #1a1410;
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.35rem;
}

.buyer-promo-modal__title {
  margin: 0 0 0.85rem;
  padding: 0 1.5rem;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.02em;
}

.buyer-promo-modal__media {
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.buyer-promo-modal__media img {
  display: block;
  width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.buyer-promo-modal__gift {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0 0.5rem;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: rgba(247, 168, 41, 0.16);
  color: #c47a00;
  font-size: 0.78rem;
  font-weight: 700;
}

.buyer-promo-modal__meta {
  margin: 0 0 1rem;
  padding: 0 0.35rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #5c534c;
  white-space: pre-line;
}

.buyer-promo-modal__actions {
  width: 100%;
  margin-top: auto;
}

.buyer-promo-modal__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  min-height: 3rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 999px;
  background: #2f2620;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.buyer-promo-modal__cta:hover {
  background: #1f1814;
  color: #fff;
}

.buyer-promo-modal-enter-active,
.buyer-promo-modal-leave-active {
  transition: opacity 0.2s ease;
}

.buyer-promo-modal-enter-from,
.buyer-promo-modal-leave-to {
  opacity: 0;
}
</style>
