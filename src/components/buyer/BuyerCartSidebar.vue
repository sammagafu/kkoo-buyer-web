<template>
  <aside class="buyer-cart-sidebar" :class="{ 'buyer-cart-sidebar--embedded': embedded }" :aria-label="t('buyerXp.cart.drawerTitle')">
    <header v-if="!embedded" class="buyer-cart-sidebar__head">
      <div>
        <h2 class="buyer-cart-sidebar__title">{{ t('buyerXp.cart.title') }}</h2>
        <p class="buyer-cart-sidebar__count">{{ cartCountLabel }}</p>
      </div>
      <button type="button" class="buyer-cart-sidebar__refresh" :aria-label="t('buyerXp.cart.refresh')" @click="loadCart">
        <Icon icon="solar:refresh-bold" />
      </button>
    </header>

    <div v-if="loading" class="buyer-cart-sidebar__empty">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="buyer-cart-sidebar__empty">
      <p class="mb-1 fw-semibold">{{ t('buyerXp.cart.loadErrorTitle') }}</p>
      <p class="small text-muted mb-2">{{ error }}</p>
      <button type="button" class="buyer-venue__chip buyer-venue__chip--sm" @click="loadCart">{{ t('buyerXp.cart.tryAgain') }}</button>
    </div>
    <div v-else-if="!cartItems.length" class="buyer-cart-sidebar__empty">
      <p class="mb-1 fw-semibold">{{ t('buyerXp.cart.emptyTitle') }}</p>
      <p class="small text-muted mb-0">{{ t('buyerXp.cart.emptyHint') }}</p>
    </div>
    <ul v-else class="buyer-cart-sidebar__list">
      <li v-for="item in cartItems" :key="itemKey(item)" class="buyer-cart-sidebar__item">
        <div class="buyer-cart-sidebar__thumb" aria-hidden="true">
          <Icon icon="solar:box-bold-duotone" />
        </div>
        <div class="buyer-cart-sidebar__item-body">
          <p class="buyer-cart-sidebar__item-title">{{ item.product?.title || t('buyerXp.cart.itemFallback') }}</p>
          <p class="buyer-cart-sidebar__item-price">
            {{ formatLinePrice(item) }}
          </p>
          <div class="buyer-cart-sidebar__qty">
            <button type="button" :disabled="item.quantity <= 1" @click="updateQuantity(item, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button type="button" @click="updateQuantity(item, item.quantity + 1)">+</button>
          </div>
        </div>
        <button type="button" class="buyer-cart-sidebar__remove" :aria-label="t('buyerXp.cart.remove')" @click="removeItem(item)">
          <Icon icon="solar:trash-bin-minimalistic-linear" />
        </button>
      </li>
    </ul>

    <div class="buyer-cart-sidebar__summary">
      <div class="buyer-cart-sidebar__row">
        <span>{{ t('buyerXp.cart.subtotal') }}</span>
        <strong>{{ formattedTotal }}</strong>
      </div>
      <div class="buyer-cart-sidebar__row buyer-cart-sidebar__row--muted">
        <span>{{ t('buyerXp.cart.shipping') }}</span>
        <span>{{ t('buyerXp.cart.shippingAtCheckout') }}</span>
      </div>
      <div class="buyer-btn-row">
        <router-link
          :to="{ name: 'buyer.checkout' }"
          class="buyer-cart-sidebar__checkout buyer-venue__chip buyer-venue__chip--primary buyer-venue__chip--lg text-decoration-none"
          @click="emit('checkout')"
        >
          {{ t('buyerXp.cart.checkout') }}
        </router-link>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useWebCart } from '@/composables/useWebCart'

withDefaults(
  defineProps<{
    suggestions?: { id: string | number; title: string; price: string }[]
    /** Drawer/overlay mode — hides duplicate chrome */
    embedded?: boolean
  }>(),
  { suggestions: () => [], embedded: false },
)

const emit = defineEmits<{ checkout: [] }>()
const { t } = useI18n()

const {
  cartItems,
  loading,
  error,
  itemCount,
  formattedTotal,
  loadCart,
  updateQuantity,
  removeItem,
  itemKey,
  formatPrice,
} = useWebCart()

const cartCountLabel = computed(() =>
  itemCount.value === 1
    ? t('buyerXp.cart.item', { count: itemCount.value })
    : t('buyerXp.cart.items', { count: itemCount.value }),
)

function formatLinePrice(item: (typeof cartItems.value)[number]) {
  if (item.total_price != null) return formatPrice(item.total_price)
  const unit = item.product?.price ?? item.product?.base_price ?? 0
  return formatPrice(unit * (item.quantity || 1))
}

onMounted(() => {
  void loadCart()
})

defineExpose({ loadCart })
</script>
