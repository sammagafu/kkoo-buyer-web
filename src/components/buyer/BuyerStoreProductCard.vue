<template>
  <article class="store-product-card store-product-card--row">
    <button type="button" class="store-product-card__visual" @click="emit('open')">
      <div class="store-product-card__image-wrap">
        <img
          v-if="imageUrl && !imageError"
          :src="imageUrl"
          :alt="title || t('buyerXp.products.productFallback')"
          class="store-product-card__image"
          loading="lazy"
          @error="imageError = true"
        />
        <div v-else class="store-product-card__image store-product-card__placeholder" aria-hidden="true">
          <Icon icon="solar:gallery-minimalistic-bold-duotone" class="store-product-card__placeholder-icon" />
        </div>
        <div class="store-product-card__badges">
          <span v-if="showPreorderBadge" class="store-product-card__preorder">{{ t('buyerXp.products.preorder') }}</span>
          <span v-if="categoryLabel" class="store-product-card__category">{{ categoryLabel }}</span>
        </div>
      </div>
    </button>
    <div class="store-product-card__body">
      <div class="store-product-card__head" @click="emit('open')">
        <div class="store-product-card__copy">
          <p v-if="storeLabel" class="store-product-card__store">{{ storeLabel }}</p>
          <h3 class="store-product-card__title">{{ displayTitle }}</h3>
          <p v-if="description" class="store-product-card__desc">{{ description }}</p>
        </div>
        <p v-if="priceLabel" class="store-product-card__price">{{ priceLabel }}</p>
      </div>
      <div class="store-product-card__actions" @click.stop>
        <div class="store-product-card__qty" role="group" :aria-label="`Quantity for ${displayTitle}`">
          <button
            type="button"
            class="store-product-card__qty-btn"
            aria-label="Decrease quantity"
            @click="bumpQty(-1)"
          >
            −
          </button>
          <span class="store-product-card__qty-value">{{ quantity }}</span>
          <button
            type="button"
            class="store-product-card__qty-btn"
            aria-label="Increase quantity"
            @click="bumpQty(1)"
          >
            +
          </button>
        </div>
        <div class="store-product-card__actions-end">
          <button
            v-if="productId"
            type="button"
            class="store-product-card__favorite"
            :class="{ 'store-product-card__favorite--active': favorited }"
            :disabled="togglingFavorite"
            :aria-label="favorited ? t('buyerXp.product.removeFavorite') : t('buyerXp.product.saveFavorite')"
            @click="toggleFavorite"
          >
            <Icon :icon="favorited ? 'solar:heart-bold' : 'solar:heart-linear'" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="store-product-card__add-btn"
            :disabled="disabled || adding"
            @click="emit('add', quantity)"
          >
            {{ t('buyerXp.products.add') }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useProductFavorite } from '@/composables/useProductFavorite'

const { t } = useI18n()

const props = defineProps<{
  title?: string
  description?: string
  priceLabel?: string
  imageUrl?: string | null
  categoryLabel?: string
  storeLabel?: string
  productId?: number
  productSlug?: string
  disabled?: boolean
  adding?: boolean
  showShareEarn?: boolean
  allowPreorder?: boolean
  purchaseMode?: string
}>()

const emit = defineEmits<{ add: [quantity: number]; open: [] }>()
const imageError = ref(false)
const quantity = ref(1)

const showPreorderBadge = computed(() => {
  const mode = (props.purchaseMode || '').trim().toLowerCase()
  return mode === 'preorder' || Boolean(props.allowPreorder)
})

const displayTitle = computed(() => {
  const raw = (props.title || '').trim()
  const base = raw || t('buyerXp.products.productFallback')
  if (typeof window !== 'undefined' && window.innerWidth < 576 && base.length > 120) {
    return `${base.slice(0, 120)}…`
  }
  return base
})

const productIdRef = computed(() => props.productId)
const { favorited, toggling: togglingFavorite, toggleFavorite } = useProductFavorite(productIdRef)

function bumpQty(delta: number) {
  quantity.value = Math.max(1, Math.min(99, quantity.value + delta))
}
</script>
