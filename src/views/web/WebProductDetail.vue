<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <h1 class="buyer-page-head__title">{{ product?.title || t('buyerXp.common.productFallback') }}</h1>
      </div>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <template v-else-if="product">
      <article class="buyer-detail-card">
        <div v-if="imageUrl" class="mb-3">
          <img
            :src="imageUrl"
            :alt="product.title || ''"
            style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 1rem"
          />
        </div>
        <p v-if="product.store_name" class="buyer-page-head__meta mb-2">{{ product.store_name }}</p>
        <p v-if="product.description" class="buyer-page-head__meta mb-3">{{ product.description }}</p>
        <div class="buyer-detail-row">
          <strong style="font-size: 1.35rem">{{ formatPrice(price) }}</strong>
          <span v-if="product.average_rating" class="buyer-venue__chip">★ {{ product.average_rating }}</span>
        </div>

        <div v-if="skuOptions.length > 1" class="buyer-ride-field mt-3">
          <label>{{ t('buyerXp.product.option') }}</label>
          <select v-model="selectedSkuId">
            <option v-for="sku in skuOptions" :key="sku.id" :value="sku.id">
              {{ sku.label || `SKU #${sku.id}` }}
            </option>
          </select>
        </div>

        <div class="buyer-ride-field mt-3">
          <label>{{ t('buyerXp.product.quantity') }}</label>
          <input v-model.number="quantity" type="number" min="1" max="99" />
        </div>

        <button
          type="button"
          class="buyer-ride-bar__btn mt-3"
          style="position: static"
          :disabled="adding || !selectedSkuId"
          @click="addToCart"
        >
          {{ adding ? t('buyerXp.product.adding') : t('buyerXp.product.addToCart') }}
        </button>
        <p v-if="addError" class="buyer-xp-toast buyer-xp-toast--err mt-2">{{ addError }}</p>
      </article>

      <section v-if="reviews.length" class="buyer-surface">
        <BuyerSectionHeader :title="t('buyerXp.product.reviews')" />
        <article v-for="(r, i) in reviews" :key="i" class="buyer-detail-card">
          <div class="buyer-detail-row">
            <strong>★ {{ r.rating }}</strong>
            <span>{{ r.title }}</span>
          </div>
          <p v-if="r.comment" class="buyer-page-head__meta">{{ r.comment }}</p>
        </article>
      </section>

      <section v-if="related.length" class="buyer-surface">
        <BuyerSectionHeader :title="t('buyerXp.product.alsoLike')" />
        <BuyerProductGridSection :products="related" @add="addRelated" />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { catalogPublicApi } from '@/api/catalog'
import { reviewsApi } from '@/api/reviews'
import { cartApi } from '@/api/cart'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'
import { resolveAssetUrl } from '@/utils/assetUrl'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerProductGridSection, { type GridProduct } from '@/components/buyer/experience/BuyerProductGridSection.vue'

const props = defineProps<{ id?: string; slug?: string }>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()
const refreshBuyerCart = inject<() => Promise<void>>('refreshBuyerCart', async () => {})
const openBuyerCart = inject<() => void>('openBuyerCart', () => {})

type Product = GridProduct & {
  average_rating?: number
  slug?: string
}

type ReviewRow = { rating?: number; title?: string; comment?: string }
type SkuRow = { id?: number; label?: string; name?: string }

const product = ref<Product | null>(null)
const reviews = ref<ReviewRow[]>([])
const related = ref<GridProduct[]>([])
const loading = ref(false)
const error = ref('')
const adding = ref(false)
const addError = ref('')
const quantity = ref(1)
const selectedSkuId = ref<number | null>(null)

const price = computed(() => {
  const p = product.value as { discount_price?: number; price?: number; base_price?: number } | null
  return p?.discount_price ?? p?.price ?? p?.base_price
})
const imageUrl = computed(() => resolveAssetUrl(product.value?.cover_image ?? product.value?.image_url))
const skuOptions = computed(() => {
  const skus = (product.value?.skus ?? []) as SkuRow[]
  return skus.filter((s) => s.id != null)
})

function formatPrice(v?: number | null) {
  if (v == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(v)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const slug = props.slug || (route.name === 'buyer.product.slug' ? String(route.params.slug ?? '') : '')
    const pid = props.id || (route.name === 'buyer.product' ? String(route.params.id ?? '') : '')
    let data: Product
    if (slug) {
      const res = await catalogPublicApi.getProductBySlug(slug)
      data = res.data as Product
    } else {
      const res = await catalogPublicApi.getProductById(Number(pid))
      data = res.data as Product
    }
    product.value = data
    selectedSkuId.value = data.skus?.[0]?.id ?? null
    await Promise.all([loadReviews(data.id), loadRelated(data)])
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.product.notFound'))
    product.value = null
  } finally {
    loading.value = false
  }
}

async function loadReviews(productId?: number) {
  if (!productId) return
  try {
    const { data } = await reviewsApi.listByProduct(productId, { page: 1 })
    reviews.value = ((data as { results?: ReviewRow[] })?.results ?? []).slice(0, 5)
  } catch {
    reviews.value = []
  }
}

async function loadRelated(p: Product) {
  try {
    const { data } = await catalogPublicApi.getRecommended({
      product_id: p.id,
      slug: p.slug,
      limit: 8,
    })
    related.value = ((data as { results?: GridProduct[] })?.results ?? []).filter((x) => x.id !== p.id)
  } catch {
    related.value = []
  }
}

async function addToCart() {
  if (!auth.isAuthenticated) {
    await router.push({ name: 'auth.sign-in', query: { redirectedFrom: route.fullPath } })
    return
  }
  if (!selectedSkuId.value) return
  adding.value = true
  addError.value = ''
  try {
    await cartApi.add(Number(selectedSkuId.value), Math.max(1, quantity.value || 1))
    await refreshBuyerCart()
    openBuyerCart()
  } catch (e) {
    addError.value = formatApiError(e, t('buyerXp.common.couldNotAdd'))
  } finally {
    adding.value = false
  }
}

async function addRelated(prod: GridProduct) {
  if (!auth.isAuthenticated || !prod.skus?.[0]?.id) return
  await cartApi.add(Number(prod.skus[0].id), 1)
  await refreshBuyerCart()
  openBuyerCart()
}

watch(() => [route.params.id, route.params.slug], () => void load())

onMounted(load)
</script>

<style scoped>
.buyer-ride-field select,
.buyer-ride-field input {
  width: 100%;
  border-radius: 0.75rem;
  padding: 0.65rem;
  border: 1px solid var(--buyer-border-strong);
  background: var(--buyer-input-bg);
  color: var(--buyer-ink);
}
</style>
