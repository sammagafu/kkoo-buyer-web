<template>
  <div>
    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.products.loading') }}</p>
    <p v-else-if="error" class="shop-products__status shop-products__status--error">{{ error }}</p>
    <p v-else-if="!products.length" class="shop-products__status">{{ t('buyerXp.products.notFound') }}</p>
    <div v-else class="shop-product-grid">
      <BuyerStoreProductCard
        v-for="prod in products"
        :key="productKey(prod)"
        :title="prod.title"
        :description="prod.description"
        :price-label="formatPrice(prod.price ?? prod.base_price)"
        :image-url="productImage(prod)"
        :store-label="showStoreLabel ? prod.store_name : undefined"
        :disabled="!prod.skus?.length"
        :adding="adding"
        @add="$emit('add', prod)"
        @open="openProduct(prod)"
      />
    </div>
    <p v-if="message" class="buyer-xp-toast buyer-xp-toast--ok">{{ message }}</p>
    <p v-if="addError" class="buyer-xp-toast buyer-xp-toast--err">{{ addError }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BuyerStoreProductCard from '@/components/buyer/BuyerStoreProductCard.vue'
import { resolveAssetUrl } from '@/utils/assetUrl'

const router = useRouter()
const { t } = useI18n()

export type GridProduct = {
  id?: number
  title?: string
  description?: string
  price?: number
  base_price?: number
  cover_image?: string
  image_url?: string
  skus?: { id?: number }[]
  store_name?: string
  store_id?: number | string
}

defineProps<{
  products: GridProduct[]
  loading?: boolean
  error?: string
  message?: string
  addError?: string
  adding?: boolean
  showStoreLabel?: boolean
}>()

defineEmits<{ add: [product: GridProduct] }>()

function productKey(prod: GridProduct) {
  return String(prod.id ?? `${prod.store_id}-${prod.title}`)
}

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function productImage(prod: GridProduct) {
  return resolveAssetUrl(prod.cover_image ?? prod.image_url) ?? null
}

function openProduct(prod: GridProduct) {
  if (prod.id == null) return
  void router.push({ name: 'buyer.product', params: { id: String(prod.id) } })
}
</script>
