<template>
  <div class="buyer-pillars" role="list">
    <RouterLink
      v-for="pillar in pillars"
      :key="pillar.id"
      :to="{ name: pillar.routeName }"
      class="buyer-pillar"
      :class="`buyer-pillar--${pillar.tone}`"
      role="listitem"
    >
      <span class="buyer-pillar__icon" aria-hidden="true">
        <Icon :icon="pillar.icon" />
      </span>
      <span class="buyer-pillar__label">{{ pillar.label }}</span>
      <span class="buyer-pillar__sub">{{ pillar.subtitle }}</span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { BUYER_PILLARS } from '@/constants/buyerPillars'

const { t } = useI18n()

const pillars = computed(() =>
  BUYER_PILLARS.map((pillar) => ({
    ...pillar,
    label: t(`buyerXp.pillars.${pillar.id}.label`),
    subtitle: t(`buyerXp.pillars.${pillar.id}.subtitle`),
  })),
)
</script>
