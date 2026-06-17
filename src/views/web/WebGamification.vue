<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.gamification.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.gamification.meta') }}</p>
    </header>
    <section class="buyer-surface">
      <GamificationHub />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GamificationHub from '@/components/GamificationHub.vue'

const { t } = useI18n()
</script>
