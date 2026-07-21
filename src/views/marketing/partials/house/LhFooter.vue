<template>
  <footer id="contacts" ref="rootRef" class="lh-footer lh-page lh-reveal">
    <div class="lh-footer__panel">
      <div>
        <img :src="houseLogoLight" class="lh-footer__logo" :alt="copy.brand" width="128" height="128" />
        <h2>{{ copy.footer.title }}</h2>
        <p class="lh-footer__lead">{{ copy.footer.lead }}</p>
      </div>
      <div class="lh-footer__actions">
        <LhButton
          as="router-link"
          :to="buyerRoutes.marketplace"
          variant="on-dark"
          size="lg"
          with-well
        >
          {{ copy.ctaPrimary }}
        </LhButton>
        <LhButton
          as="router-link"
          :to="buyerRoutes.merchant"
          variant="ghost"
          size="lg"
          class="lh-footer__ghost"
        >
          Sell on KKOO
        </LhButton>
        <LhButton
          as="router-link"
          :to="buyerRoutes.getStarted"
          variant="ghost"
          size="lg"
          class="lh-footer__ghost"
        >
          {{ copy.ctaSecondary }}
        </LhButton>
      </div>
    </div>
    <nav class="lh-footer__roles" aria-label="Roles">
      <a
        v-for="item in footerNavItems"
        :key="item.id"
        :href="sectionHref(item.id)"
        @click="onFooterNavClick(item.id, $event)"
      >
        {{ item.label }}
      </a>
    </nav>
    <div class="lh-footer__meta">
      <span>© {{ year }} {{ copy.brand }}</span>
      <span>{{ copy.footer.meta }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { houseCopy as copy, houseLogoLight } from '@/config/landing-house'
import { buyerRoutes } from '@/config/landing-links'
import { useLandingScroll } from '@/composables/useLandingScroll'
import { useHouseReveal } from '@/composables/useHouseReveal'
import LhButton from './LhButton.vue'

const { sectionHref, onAnchorClick } = useLandingScroll()

const footerNavItems = computed(() =>
  (['buy', 'sell', 'pos', 'business', 'ride', 'earn'] as const).map((id) => ({
    id,
    label: copy.nav[id],
  })),
)

function onFooterNavClick(id: string, event: MouseEvent) {
  onAnchorClick(id, event)
}

const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)

const year = new Date().getFullYear()
</script>
