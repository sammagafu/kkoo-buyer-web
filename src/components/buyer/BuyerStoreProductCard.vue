<template>
  <article
    class="store-product-card"
    :class="layout === 'grid' ? 'store-product-card--grid store-product-card--featured' : 'store-product-card--row'"
  >
    <!-- Featured grid catalogue card -->
    <template v-if="layout === 'grid'">
      <div class="store-product-card__featured-shell">
        <div class="store-product-card__featured-visual">
          <button type="button" class="store-product-card__visual" @click="emit('open')">
            <div class="store-product-card__image-wrap store-product-card__image-wrap--featured">
              <img
                v-if="imageUrl && !imageError"
                :src="imageUrl"
                :alt="title || t('buyerXp.products.productFallback')"
                class="store-product-card__image store-product-card__image--contain"
                loading="lazy"
                @error="imageError = true"
              />
              <div v-else class="store-product-card__image store-product-card__placeholder" aria-hidden="true">
                <Icon icon="solar:gallery-minimalistic-bold-duotone" class="store-product-card__placeholder-icon" />
              </div>
            </div>
          </button>
          <span v-if="statusBadge" class="store-product-card__status-badge">{{ statusBadge }}</span>
          <button
            v-if="productId"
            type="button"
            class="store-product-card__wish"
            :class="{ 'store-product-card__wish--active': favorited }"
            :disabled="togglingFavorite"
            :aria-label="favorited ? t('buyerXp.product.removeFavorite') : t('buyerXp.product.saveFavorite')"
            @click.stop="toggleFavorite"
          >
            <Icon :icon="favorited ? 'solar:heart-bold' : 'solar:heart-linear'" aria-hidden="true" />
          </button>
          <div class="store-product-card__gallery-dots" aria-hidden="true">
            <span class="store-product-card__gallery-dot is-active" />
          </div>
        </div>

        <div class="store-product-card__body store-product-card__body--featured">
          <button type="button" class="store-product-card__copy-btn" @click="emit('open')">
            <p v-if="storeLabel" class="store-product-card__store">{{ storeLabel }}</p>
            <h3 class="store-product-card__title">{{ displayTitle }}</h3>
            <p v-if="description" class="store-product-card__desc">{{ description }}</p>
            <p v-if="ratingLine" class="store-product-card__rating">
              <Icon icon="solar:star-bold" class="store-product-card__rating-icon" aria-hidden="true" />
              {{ ratingLine }}
            </p>
          </button>
          <div class="store-product-card__foot">
            <p v-if="priceLabel" class="store-product-card__price">{{ priceLabel }}</p>
            <button
              type="button"
              class="store-product-card__cart-btn"
              :disabled="disabled || adding"
              @click.stop="emit('add', 1)"
            >
              <Icon icon="solar:cart-large-2-bold" aria-hidden="true" />
              <span class="store-product-card__cart-label">{{ t('buyerXp.products.add') }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- List / row layout -->
    <template v-else>
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
          <div
            class="store-product-card__qty"
            role="group"
            :aria-label="`Quantity for ${displayTitle}`"
          >
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
    </template>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useProductFavorite } from '@/composables/useProductFavorite'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
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
    layout?: 'grid' | 'list'
    rating?: number | null
    reviewCount?: number | null
    badgeLabel?: string
  }>(),
  { layout: 'grid' },
)

const emit = defineEmits<{ add: [quantity: number]; open: [] }>()
const imageError = ref(false)
const quantity = ref(1)

const showPreorderBadge = computed(() => {
  const mode = (props.purchaseMode || '').trim().toLowerCase()
  return mode === 'preorder' || Boolean(props.allowPreorder)
})

const statusBadge = computed(() => {
  const custom = String(props.badgeLabel ?? '').trim()
  if (custom) return custom
  if (showPreorderBadge.value) return t('buyerXp.products.preorder').toUpperCase()
  const cat = String(props.categoryLabel ?? '').trim()
  if (cat) return cat.toUpperCase()
  return ''
})

const ratingLine = computed(() => {
  const score = props.rating
  if (score == null || !Number.isFinite(Number(score)) || Number(score) <= 0) return ''
  const formatted = Number(score).toFixed(1)
  const count = props.reviewCount
  if (count != null && Number(count) > 0) return `${formatted} (${count})`
  return formatted
})

const displayTitle = computed(() => {
  const raw = (props.title || '').trim()
  const base = raw || t('buyerXp.products.productFallback')
  if (props.layout === 'grid' && base.length > 64) {
    return `${base.slice(0, 64)}…`
  }
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
