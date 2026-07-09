<template>
  <div class="lp-mobile-cta" role="navigation" :aria-label="t('landing.headerGetApp')">
    <a href="#download" class="lp-mobile-cta__btn lp-mobile-cta__btn--primary" @click.prevent="scrollToDownload">
      <Icon icon="solar:download-minimalistic-bold" aria-hidden="true" />
      <span class="lp-mobile-cta__label">{{ t('landing.headerGetApp') }}</span>
    </a>
    <a
      :href="bizSellerRegisterUrl"
      class="lp-mobile-cta__btn lp-mobile-cta__btn--ghost"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon icon="solar:shop-2-bold" aria-hidden="true" />
      <span class="lp-mobile-cta__label">{{ t('landing.sellerValue.mobileCtaSell') }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { bizSellerRegisterUrl } from '@/config/landing-links'

const { t } = useI18n()

function scrollToDownload() {
  document.getElementById('download')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
/* Thumb-reach action bar for phones; hidden on desktop where header CTAs are visible. */
.lp-mobile-cta {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1030;
  display: flex;
  gap: 0.6rem;
  padding: 0.6rem 0.9rem calc(0.6rem + env(safe-area-inset-bottom, 0px));
  background: color-mix(in srgb, var(--bs-body-bg) 88%, transparent);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(var(--bs-body-color-rgb), 0.08);
}

@media (min-width: 992px) {
  .lp-mobile-cta {
    display: none;
  }
}

.lp-mobile-cta__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
  min-height: 2.9rem;
  padding: 0.55rem 0.75rem;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
}

.lp-mobile-cta__label {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lp-mobile-cta__btn--primary {
  background: var(--bs-primary);
  color: #fff;
}

.lp-mobile-cta__btn--primary:hover {
  color: #fff;
}

.lp-mobile-cta__btn--ghost {
  border: 1.5px solid rgba(var(--bs-primary-rgb), 0.4);
  color: var(--bs-primary);
  background: transparent;
}
</style>
