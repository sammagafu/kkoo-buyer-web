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
        <div class="store-product-card__quick" @click.stop>
          <button
            type="button"
            class="store-product-card__add"
            :disabled="disabled || adding"
            @click="emit('add')"
          >
            <Icon icon="solar:bag-heart-bold" aria-hidden="true" />
            <span>{{ adding ? '…' : t('buyerXp.products.add') }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="store-product-card__meta" @click="emit('open')">
      <p v-if="storeLabel" class="store-product-card__store">{{ storeLabel }}</p>
      <h3 class="store-product-card__title">{{ title || t('buyerXp.products.productFallback') }}</h3>
      <p v-if="description" class="store-product-card__desc">{{ description }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  title?: string
  description?: string
  priceLabel?: string
  imageUrl?: string | null
  categoryLabel?: string
  storeLabel?: string
  disabled?: boolean
  adding?: boolean
}>()

const emit = defineEmits<{ add: []; open: [] }>()
const imageError = ref(false)
</script>
