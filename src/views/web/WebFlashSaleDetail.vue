<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-home-hero">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
      </div>
      <p class="buyer-home-hero__overline">{{ t('buyerXp.flashSales.overlineDetail') }}</p>
      <h1 class="buyer-home-hero__name">{{ sale?.name || t('buyerXp.common.dealFallback') }}</h1>
      <p v-if="sale?.description" class="buyer-home-hero__tagline">{{ sale.description }}</p>
      <p v-if="sale?.end_at" class="buyer-page-head__meta">{{ t('buyerXp.flashSales.ends', { date: formatDate(sale.end_at) }) }}</p>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else-if="sale" class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.flashSales.dealsCount', { count: products.length })" />
      <BuyerProductGridSection
        :products="products"
        :adding="adding"
        :add-error="addError"
        @add="addProduct"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { getFlashSale } from '@/api/flashSales'
import { catalogPublicApi } from '@/api/catalog'
import { cartApi } from '@/api/cart'
import type { FlashSale } from '@/types/flashSales'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerProductGridSection, { type GridProduct } from '@/components/buyer/experience/BuyerProductGridSection.vue'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()
const refreshBuyerCart = inject<() => Promise<void>>('refreshBuyerCart', async () => {})
const openBuyerCart = inject<() => void>('openBuyerCart', () => {})

const sale = ref<FlashSale | null>(null)
const products = ref<GridProduct[]>([])
const loading = ref(false)
const error = ref('')
const adding = ref(false)
const addError = ref('')

function formatDate(v: string) {
  return new Date(v).toLocaleString()
}

async function load() {
  const slug = props.slug || String(route.params.slug ?? '')
  loading.value = true
  try {
    sale.value = await getFlashSale(slug)
    const ids = (sale.value.items ?? []).map((i) => i.product_id).filter(Boolean)
    if (!ids.length) {
      products.value = []
      return
    }
    const loaded: GridProduct[] = []
    for (const id of ids.slice(0, 24)) {
      try {
        const { data } = await catalogPublicApi.getProductById(id)
        const item = sale.value.items?.find((x) => x.product_id === id)
        const p = data as GridProduct
        if (item?.sale_price != null) p.price = item.sale_price
        loaded.push(p)
      } catch {
        // skip missing product
      }
    }
    products.value = loaded
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.flashSales.notFound'))
  } finally {
    loading.value = false
  }
}

async function addProduct(prod: GridProduct) {
  if (!auth.isAuthenticated) {
    addError.value = t('buyerXp.common.signInToAdd')
    return
  }
  const skuId = prod.skus?.[0]?.id
  if (!skuId) return
  adding.value = true
  try {
    await cartApi.add(Number(skuId), 1)
    await refreshBuyerCart()
    openBuyerCart()
  } catch (e) {
    addError.value = formatApiError(e, t('buyerXp.common.couldNotAdd'))
  } finally {
    adding.value = false
  }
}

onMounted(load)
</script>
