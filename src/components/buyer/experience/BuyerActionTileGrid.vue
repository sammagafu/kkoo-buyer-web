<template>
  <div class="buyer-action-grid" role="list">
    <component
      :is="actionLink(action).is"
      v-for="action in actions"
      :key="action.id"
      v-bind="actionLink(action).bind"
      class="buyer-action-tile"
      :class="[
        `buyer-action-tile--${action.tone}`,
        { 'buyer-action-tile--wide': action.wide },
      ]"
      role="listitem"
    >
      <Icon :icon="action.icon" class="buyer-action-tile__icon" aria-hidden="true" />
      <span class="buyer-action-tile__label">{{ t(action.labelKey) }}</span>
      <span class="buyer-action-tile__sub">{{ t(action.subKey) }}</span>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { BUYER_HOME_ACTIONS, type BuyerHomeAction } from '@/constants/buyerHomeActions'

const { t } = useI18n()

const actions = computed(() => BUYER_HOME_ACTIONS)

function actionLink(action: BuyerHomeAction) {
  if (action.href) {
    return {
      is: 'a' as const,
      bind: { href: action.href, target: '_blank', rel: 'noopener noreferrer' },
    }
  }
  return {
    is: RouterLink,
    bind: { to: { name: action.routeName! } },
  }
}
</script>
