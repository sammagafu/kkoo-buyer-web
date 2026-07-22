<template>
  <TrustPageShell :kicker="t('trust.newsKicker')" :title="t('trust.newsTitle')" :lead="t('trust.newsLead')">
    <ul class="trust-news" role="list">
      <li v-for="item in items" :key="item.id" class="trust-news__item">
        <time>{{ item.date }}</time>
        <h2>{{ item.title }}</h2>
        <p>{{ item.summary }}</p>
      </li>
    </ul>
    <p class="trust-page__note">{{ t('trust.newsMore') }}</p>
  </TrustPageShell>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TrustPageShell from '@/views/marketing/components/TrustPageShell.vue'

const { t } = useI18n()
const items = computed(() => [
  {
    id: 'launch',
    date: '2026',
    title: t('trust.newsItem1Title'),
    summary: t('trust.newsItem1Body'),
  },
  {
    id: 'escrow',
    date: '2026',
    title: t('trust.newsItem2Title'),
    summary: t('trust.newsItem2Body'),
  },
])
</script>
