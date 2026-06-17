<template>
  <div class="buyer-xp">
    <header class="buyer-home-hero">
      <p class="buyer-home-hero__overline">{{ t('buyerXp.hub.servicesOverline') }}</p>
      <h1 class="buyer-home-hero__name">{{ t('buyerXp.hub.servicesTitle') }}</h1>
      <p class="buyer-home-hero__tagline">{{ t('buyerXp.hub.servicesTagline') }}</p>
    </header>

    <section class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.hub.shopAndMove')" :overline="t('buyerXp.common.explore')" />
      <div class="buyer-hub-list">
        <BuyerHubCard
          v-for="tile in serviceTiles"
          :key="tile.id"
          :title="tile.title"
          :subtitle="tile.subtitle"
          :icon="tile.icon"
          :tone="tile.tone"
          :to="{ name: tile.routeName }"
        />
      </div>
    </section>

    <section class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.hub.accountSupport')" />
      <div class="buyer-hub-list">
        <BuyerHubCard
          v-for="tile in accountTiles"
          :key="tile.id"
          :title="tile.title"
          :subtitle="tile.subtitle"
          :icon="tile.icon"
          :tone="tile.tone"
          :to="{ name: tile.routeName }"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerHubCard from '@/components/buyer/experience/BuyerHubCard.vue'
import { useBuyerFeatureTiles } from '@/composables/useBuyerFeatureTiles'

const { t } = useI18n()
const { serviceTiles, accountTiles } = useBuyerFeatureTiles()
</script>
