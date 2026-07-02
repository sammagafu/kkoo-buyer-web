<template>
  <article class="store-product-card">
    <div class="store-product-card__visual" @click="emit('open')">
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
        <div class="store-product-card__veil" aria-hidden="true" />
        <span v-if="categoryLabel" class="store-product-card__category">{{ categoryLabel }}</span>
        <span v-if="priceLabel" class="store-product-card__price-tag">{{ priceLabel }}</span>
        <div v-if="productId" class="store-product-card__actions-top" @click.stop>
          <button
            type="button"
            class="store-product-card__favorite"
            :class="{ 'store-product-card__favorite--active': favorited }"
            :disabled="togglingFavorite"
            :aria-label="favorited ? t('buyerXp.product.removeFavorite') : t('buyerXp.product.saveFavorite')"
            :title="favorited ? t('buyerXp.product.removeFavorite') : t('buyerXp.product.saveFavorite')"
            @click="toggleFavorite"
          >
            <Icon :icon="favorited ? 'solar:heart-bold' : 'solar:heart-linear'" aria-hidden="true" />
          </button>
        </div>
        <div class="store-product-card__actions-bottom" @click.stop>
          <button
            type="button"
            class="store-product-card__add"
            :disabled="disabled || adding"
            :aria-label="t('buyerXp.products.add')"
            :title="t('buyerXp.products.add')"
            @click="emit('add')"
          >
            <Icon icon="solar:bag-heart-bold" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
    <div class="store-product-card__meta" @click="emit('open')">
      <p v-if="storeLabel" class="store-product-card__store">{{ storeLabel }}</p>
      <div class="store-product-card__title-row">
        <h3 class="store-product-card__title">{{ title || t('buyerXp.products.productFallback') }}</h3>
        <span v-if="priceLabel" class="store-product-card__price-inline">{{ priceLabel }}</span>
      </div>
      <p v-if="description" class="store-product-card__desc">{{ description }}</p>
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
}>()

const emit = defineEmits<{ add: []; open: [] }>()
const imageError = ref(false)

const productIdRef = computed(() => props.productId)
const { favorited, toggling: togglingFavorite, toggleFavorite } = useProductFavorite(productIdRef)
</script>
