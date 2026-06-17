<template>
  <Teleport to="body">
    <Transition name="buyer-cart-overlay">
      <div
        v-if="modelValue"
        class="buyer-cart-overlay"
        role="presentation"
        @click.self="close"
      >
        <aside
          class="buyer-cart-overlay__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
          @click.stop
        >
          <header class="buyer-cart-overlay__head">
            <div>
              <h2 class="buyer-cart-overlay__title">{{ t('buyerXp.cart.drawerTitle') }}</h2>
              <p v-if="itemCount > 0" class="buyer-notify-overlay__sub">{{ cartCountLabel }}</p>
            </div>
            <button type="button" class="buyer-cart-overlay__close" :aria-label="t('common.close')" @click="close">
              <Icon icon="solar:close-circle-bold" />
            </button>
          </header>
          <BuyerCartSidebar
            class="buyer-cart-overlay__body"
            embedded
            @checkout="close"
          />
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import BuyerCartSidebar from '@/components/buyer/BuyerCartSidebar.vue'
import { useWebCart } from '@/composables/useWebCart'

const modelValue = defineModel<boolean>({ default: false })
const { itemCount } = useWebCart()
const { t } = useI18n()

const cartCountLabel = computed(() =>
  itemCount.value === 1
    ? t('buyerXp.cart.item', { count: itemCount.value })
    : t('buyerXp.cart.items', { count: itemCount.value }),
)

function close() {
  modelValue.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && modelValue.value) close()
}

watch(modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>
