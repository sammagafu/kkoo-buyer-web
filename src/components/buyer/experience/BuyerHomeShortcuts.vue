<template>
  <div class="buyer-shortcuts" role="list">
    <RouterLink
      v-for="item in shortcuts"
      :key="item.id"
      :to="{ name: item.routeName }"
      class="buyer-shortcut"
      role="listitem"
    >
      <Icon :icon="item.icon" class="buyer-shortcut__icon" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { BUYER_HOME_SHORTCUTS } from '@/constants/buyerPillars'

const { t } = useI18n()

const shortcuts = computed(() =>
  BUYER_HOME_SHORTCUTS.map((item) => ({
    ...item,
    label: t(`buyerXp.shortcuts.${item.id}`),
  })),
)
</script>
