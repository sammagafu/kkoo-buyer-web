<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <h1 class="buyer-page-head__title">{{ product?.title || t('buyerXp.common.productFallback') }}</h1>
        <button
          v-if="product?.id || product?.slug"
          type="button"
          class="buyer-page-head__action"
          :disabled="sharing"
          @click="shareProduct"
        >
          <Icon icon="solar:share-bold" aria-hidden="true" />
          <span>{{ sharing ? '…' : t('buyerXp.shareEarn.shareShort') }}</span>
        </button>
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
        <div class="buyer-detail-row buyer-detail-row--actions">
          <strong style="font-size: 1.35rem">{{ formatPrice(price) }}</strong>
          <div class="buyer-detail-actions">
            <button
              v-if="product.id"
              type="button"
              class="buyer-detail-actions__btn"
              :class="{ 'buyer-detail-actions__btn--active': favorited }"
              :disabled="togglingFavorite"
              :aria-label="favorited ? t('buyerXp.product.removeFavorite') : t('buyerXp.product.saveFavorite')"
              :title="favorited ? t('buyerXp.product.removeFavorite') : t('buyerXp.product.saveFavorite')"
              @click="toggleFavorite"
            >
              <Icon :icon="favorited ? 'solar:heart-bold' : 'solar:heart-linear'" aria-hidden="true" />
            </button>
            <button
              v-if="product.id || product.slug"
              type="button"
              class="buyer-detail-actions__btn"
              :disabled="sharing"
              :aria-label="t('buyerXp.product.share')"
              :title="t('buyerXp.product.share')"
              @click="shareProduct"
            >
              <Icon icon="solar:share-bold" aria-hidden="true" />
            </button>
            <span v-if="product.average_rating" class="buyer-venue__chip">★ {{ product.average_rating }}</span>
          </div>
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
        <p v-if="addMessage" class="buyer-xp-toast buyer-xp-toast--ok mt-2">{{ addMessage }}</p>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { catalogPublicApi, catalogSellerApi } from '@/api/catalog'
import { reviewsApi } from '@/api/reviews'
import { useAuthStore } from '@/stores/auth'
import { resolveAssetUrl } from '@/utils/assetUrl'
import { formatApiError } from '@/utils/formatApiError'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerProductGridSection, { type GridProduct } from '@/components/buyer/experience/BuyerProductGridSection.vue'
import { useProductShareEarn } from '@/composables/useProductShareEarn'
import { useProductFavorite } from '@/composables/useProductFavorite'
import { useAddToCart } from '@/composables/useAddToCart'

const props = defineProps<{ id?: string; slug?: string }>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()
const { adding, addError, addMessage, addProduct: addProductToCart } = useAddToCart()
const { requestShare } = useProductShareEarn()

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
const quantity = ref(1)
const selectedSkuId = ref<number | null>(null)
const sharing = ref(false)

const productId = computed(() => product.value?.id ?? null)
const { favorited, toggling: togglingFavorite, toggleFavorite } = useProductFavorite(productId)

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
    if (auth.isAuthenticated && data.id) {
      void catalogSellerApi.recordView(Number(data.id)).catch(() => undefined)
    }
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

async function shareProduct() {
  const p = product.value
  if (!p?.id && !p?.slug) return
  sharing.value = true
  try {
    await requestShare({
      productId: p.id,
      productSlug: p.slug,
      title: p.title,
      priceLabel: formatPrice(price.value),
      imageUrl: imageUrl.value,
    })
  } finally {
    sharing.value = false
  }
}

async function addToCart() {
  const p = product.value
  if (!p || !selectedSkuId.value) return
  await addProductToCart(
    { ...p, skus: [{ id: selectedSkuId.value }] },
    Math.max(1, quantity.value || 1),
  )
}

async function addRelated(prod: GridProduct) {
  await addProductToCart(prod)
}

watch(() => [route.params.id, route.params.slug], () => void load())

onMounted(load)
</script>

<style scoped>
.buyer-detail-row--actions {
  align-items: center;
  gap: 0.75rem;
}

.buyer-detail-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-left: auto;
}

.buyer-detail-actions__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  padding: 0;
  border: 1px solid var(--buyer-border-strong);
  border-radius: 999px;
  background: var(--buyer-card-bg, var(--buyer-surface));
  color: var(--kkoo-primary);
  font-size: 1.05rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 26, 90, 0.08);
}

.buyer-detail-actions__btn--active {
  border-color: rgba(220, 53, 69, 0.3);
  color: #dc3545;
}

.buyer-detail-actions__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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
