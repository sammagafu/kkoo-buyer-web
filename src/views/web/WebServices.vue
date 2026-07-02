<template>
  <div class="buyer-xp buyer-xp--wide buyer-services-page">
    <header class="buyer-services-hero">
      <p class="buyer-services-hero__overline">{{ t('buyerXp.hub.servicesOverline') }}</p>
      <h1 class="buyer-services-hero__title">{{ t('buyerXp.hub.servicesTitle') }}</h1>
      <p class="buyer-services-hero__tagline">{{ t('buyerXp.hub.servicesTagline') }}</p>
      <BuyerSearchBar
        readonly
        :placeholder="t('buyerXp.search.placeholder')"
        @tap="goSearch"
      />
    </header>

    <section class="buyer-surface buyer-services-popular" :aria-label="t('buyerXp.hub.popularServices')">
      <BuyerSectionHeader
        :title="t('buyerXp.hub.popularServices')"
        :overline="t('buyerXp.common.explore')"
      />
      <BuyerPillarStrip />
    </section>

    <section class="buyer-surface" :aria-label="t('buyerXp.hub.shopAndMove')">
      <BuyerSectionHeader :title="t('buyerXp.hub.shopAndMove')" />
      <div class="buyer-services-bento" role="list">
        <RouterLink
          v-for="(tile, index) in serviceTiles"
          :key="tile.id"
          :to="{ name: tile.routeName }"
          class="buyer-service-tile text-decoration-none"
          :class="[
            toneClass(tile.tone),
            { 'buyer-service-tile--featured': index < 2 },
          ]"
          role="listitem"
        >
          <span class="buyer-service-tile__icon" aria-hidden="true">
            <Icon :icon="tile.icon" />
          </span>
          <span class="buyer-service-tile__copy">
            <strong class="buyer-service-tile__title">{{ tile.title }}</strong>
            <span class="buyer-service-tile__sub">{{ tile.subtitle }}</span>
          </span>
          <Icon icon="solar:arrow-right-up-linear" class="buyer-service-tile__arrow" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>

    <section class="buyer-surface" :aria-label="t('buyerXp.hub.accountSupport')">
      <BuyerSectionHeader
        :title="t('buyerXp.hub.accountSupport')"
        :subtitle="t('buyerXp.hub.accountSupportSub')"
      />
      <div class="buyer-services-account" role="list">
        <RouterLink
          v-for="tile in accountTiles"
          :key="tile.id"
          :to="{ name: tile.routeName }"
          class="buyer-services-account__chip text-decoration-none"
          :class="toneClass(tile.tone)"
          role="listitem"
        >
          <span class="buyer-services-account__icon" aria-hidden="true">
            <Icon :icon="tile.icon" />
          </span>
          <span class="buyer-services-account__label">{{ tile.title }}</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerPillarStrip from '@/components/buyer/experience/BuyerPillarStrip.vue'
import { useBuyerFeatureTiles } from '@/composables/useBuyerFeatureTiles'

const { t } = useI18n()
const router = useRouter()
const { serviceTiles, accountTiles } = useBuyerFeatureTiles()

function toneClass(tone?: string) {
  return tone ? `buyer-service-tile--${tone}` : 'buyer-service-tile--primary'
}

function goSearch() {
  router.push({ name: 'buyer.search' })
}
</script>
