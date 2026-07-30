<template>
  <section id="trust" ref="rootRef" class="lh-section lh-trust lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--premium">
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
