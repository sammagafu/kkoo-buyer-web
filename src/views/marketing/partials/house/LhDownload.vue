<template>
  <section id="download" ref="rootRef" class="lh-section lh-download lh-page lh-reveal">
    <header class="lh-section-head lh-section-head--premium">
      <p class="lh-kicker">{{ t('trust.downloadKicker') }}</p>
      <h2 class="lh-section__title">{{ t('trust.downloadTitle') }}</h2>
      <p class="lh-section__lead">{{ t('trust.downloadLead') }}</p>
    </header>

    <div class="lh-download__tabs" role="tablist" :aria-label="t('trust.downloadTabsA11y')">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        role="tab"
        class="lh-download__tab"
        :class="{ 'is-active': active === tab.key }"
        :aria-selected="active === tab.key"
        @click="active = tab.key"
      >
        {{ t(tab.labelKey) }}
      </button>
    </div>

    <div class="lh-download__panel">
      <div class="lh-download__copy">
        <h3>{{ t(activeTab.titleKey) }}</h3>
        <p>{{ t(activeTab.bodyKey) }}</p>
        <div class="lh-download__stores">
          <a
            :href="activeTab.links.appStore"
            class="lh-download__store"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="ic:baseline-apple" width="22" height="22" />
            <span>
              <small>{{ t('landing.footerStoreKickerApple') }}</small>
              <strong>{{ t('landing.footerAppStore') }}</strong>
            </span>
          </a>
          <a
            :href="activeTab.links.googlePlay"
            class="lh-download__store"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="logos:google-play-icon" width="20" height="20" />
            <span>
              <small>{{ t('landing.footerStoreKickerGoogle') }}</small>
              <strong>{{ t('landing.footerGooglePlay') }}</strong>
            </span>
          </a>
        </div>
      </div>
      <div class="lh-download__device" aria-hidden="true">
        <div class="lh-download__phone">
          <img
            class="lh-download__phone-screen"
            :src="phoneScreen"
            alt=""
            width="463"
            height="925"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { appLinks } from '@/config/app-links'
import { useHouseReveal } from '@/composables/useHouseReveal'
import phoneScreen from '@/assets/landing/download-phone-apps.png'

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
useHouseReveal(rootRef)

const tabs = [
  {
    key: 'buyers',
    labelKey: 'trust.downloadTabBuyers',
    titleKey: 'trust.downloadBuyersTitle',
    bodyKey: 'trust.downloadBuyersBody',
    links: appLinks.marketplace,
  },
  {
    key: 'business',
    labelKey: 'trust.downloadTabBusiness',
    titleKey: 'trust.downloadBusinessTitle',
    bodyKey: 'trust.downloadBusinessBody',
    links: appLinks.business,
  },
  {
    key: 'rides',
    labelKey: 'trust.downloadTabRides',
    titleKey: 'trust.downloadRidesTitle',
    bodyKey: 'trust.downloadRidesBody',
    links: appLinks.rides,
  },
] as const

type TabKey = (typeof tabs)[number]['key']
const active = ref<TabKey>('buyers')
const activeTab = computed(() => tabs.find((tab) => tab.key === active.value) ?? tabs[0])
</script>
