<template>
  <section id="trust" ref="rootRef" class="lh-section lh-trust lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--premium lh-trust__head">
      <p class="lh-kicker">{{ t('landingHouse.kickers.trust') }}</p>
      <h2 class="lh-section__title">{{ t('landingHouse.trust.title') }}</h2>
      <p class="lh-section__lead">{{ t('landingHouse.trust.lead') }}</p>
    </header>

    <div class="lh-trust__band">
      <ul class="lh-trust__list" role="list">
        <li
          v-for="(item, index) in trust"
          :key="item.key"
          class="lh-trust-item"
          :style="{ '--lh-trust-delay': `${index * 90}ms` }"
        >
          <span class="lh-trust-item__mark" aria-hidden="true">
            <Icon :icon="item.icon" width="24" height="24" />
          </span>
          <div class="lh-trust-item__copy">
            <p class="lh-trust-item__label">{{ pad(index + 1) }}</p>
            <h3>{{ t(`landingHouse.trust.items.${item.key}.title`) }}</h3>
            <p>{{ t(`landingHouse.trust.items.${item.key}.text`) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { houseTrust as trust } from '@/config/landing-house'
import { useHouseReveal } from '@/composables/useHouseReveal'

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)

function pad(n: number) {
  return String(n).padStart(2, '0')
}
</script>

<style scoped>
.lh-trust__head {
  max-width: min(40rem, 100%);
  gap: 0.65rem;
  margin-bottom: 1.75rem;
}

.lh-trust__head :deep(.lh-section__title) {
  max-width: none;
  text-wrap: balance;
}

.lh-trust__head :deep(.lh-section__lead) {
  margin-top: 0;
  max-width: none;
  text-wrap: pretty;
}

.lh-trust__list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.35rem;
}

.lh-trust-item p {
  max-width: none;
}

@media (min-width: 720px) {
  .lh-trust__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0;
  }

  .lh-trust-item {
    padding: 1.25rem 1.4rem;
    min-width: 0;
  }

  .lh-trust-item:nth-child(odd) {
    padding-left: 0;
    border-right: 1px solid rgba(255, 250, 246, 0.12);
  }

  .lh-trust-item:nth-child(even) {
    padding-right: 0;
  }

  .lh-trust-item:nth-child(-n + 2) {
    padding-top: 0;
    border-bottom: 1px solid rgba(255, 250, 246, 0.12);
  }

  .lh-trust-item:nth-last-child(-n + 2) {
    padding-bottom: 0;
  }
}
</style>

