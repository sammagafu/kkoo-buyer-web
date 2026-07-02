<template>
  <div class="lp-store-badges" :class="{ 'lp-store-badges--row': layout === 'row' }">
    <a
      :href="appLinks.marketplace.appStore"
      target="_blank"
      rel="noopener noreferrer"
      class="lp-store-badge"
      :aria-label="t('landing.storeBadgeAppleKicker') + ' ' + t('landing.storeBadgeAppleBrand')"
    >
      <span class="lp-store-badge__icon" aria-hidden="true">
        <Icon icon="logos:apple" />
      </span>
      <span class="lp-store-badge__text">
        <span class="lp-store-badge__kicker">{{ t('landing.storeBadgeAppleKicker') }}</span>
        <span class="lp-store-badge__brand">{{ t('landing.storeBadgeAppleBrand') }}</span>
      </span>
    </a>
    <a
      :href="appLinks.marketplace.googlePlay"
      target="_blank"
      rel="noopener noreferrer"
      class="lp-store-badge"
      :aria-label="t('landing.storeBadgeGoogleKicker') + ' ' + t('landing.storeBadgeGoogleBrand')"
    >
      <span class="lp-store-badge__icon lp-store-badge__icon--play" aria-hidden="true">
        <Icon icon="logos:google-play-icon" />
      </span>
      <span class="lp-store-badge__text">
        <span class="lp-store-badge__kicker">{{ t('landing.storeBadgeGoogleKicker') }}</span>
        <span class="lp-store-badge__brand">{{ t('landing.storeBadgeGoogleBrand') }}</span>
      </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { appLinks } from '@/config/app-links'

withDefaults(
  defineProps<{
    layout?: 'row' | 'stack'
  }>(),
  { layout: 'row' },
)

const { t } = useI18n()
</script>
