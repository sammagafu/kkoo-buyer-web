<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.favorites.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.favorites.savedCount', favorites.length) }}</p>
    </header>

    <b-alert v-if="!isAuthenticated && favorites.length" variant="info" show class="mb-3">
      <p class="mb-2 mb-md-0">{{ t('auth.favoritesSignInPrompt') }}</p>
      <div class="buyer-btn-row mt-2">
        <KkooAccountButton variant="primary" size="sm" redirect-from="/favorites" force-sign-in />
      </div>
    </b-alert>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-if="message" class="buyer-xp-toast buyer-xp-toast--ok">{{ message }}</p>
    <p v-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-if="favorites.length" class="buyer-hub-list">
      <article v-for="item in favorites" :key="String(item.id ?? item.product_id)" class="buyer-detail-card">
        <div class="buyer-detail-row">
          <strong>{{ item.title || t('buyerXp.common.productFallback') }}</strong>
          <span>{{ formatBuyerMoney(item.price ?? item.base_price) }}</span>
        </div>
        <p v-if="item.description" class="buyer-page-head__meta">{{ item.description }}</p>
        <div class="buyer-btn-row mt-2">
          <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" :disabled="adding" @click="addToCart(item)">
            {{ adding ? t('buyerXp.common.adding') : t('buyerXp.favorites.addToCart') }}
          </button>
          <RouterLink
            v-if="productLink(item)"
            :to="productLink(item)!"
            class="buyer-venue__chip"
          >
            {{ t('buyerXp.favorites.view') }}
          </RouterLink>
          <button type="button" class="buyer-venue__chip" :disabled="removing" @click="remove(item)">
            {{ t('buyerXp.favorites.remove') }}
          </button>
        </div>
      </article>
    </section>

    <BuyerEmptyState
      v-else-if="!loading"
      icon="solar:heart-bold"
      :title="t('buyerXp.favorites.emptyTitle')"
      :message="t('buyerXp.favorites.emptyMessage')"
    >
      <template #action>
        <RouterLink :to="BUYER_DASHBOARD_ROUTE" class="buyer-venue__chip buyer-venue__chip--primary">{{ t('buyerXp.common.browseMarketplace') }}</RouterLink>
      </template>
    </BuyerEmptyState>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { wishlistApi } from '@/api'
import { formatBuyerMoney } from '@/utils/buyerFormat'
import { productDetailBySlug, productDetailLink } from '@/utils/buyerDetailLinks'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import KkooAccountButton from '@/components/auth/KkooAccountButton.vue'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'
import { useAddToCart } from '@/composables/useAddToCart'
import { useAuthStore } from '@/stores/auth'
import {
  readGuestWishlist,
  removeGuestWishlistItem,
} from '@/composables/guestWishlistStorage'
import { syncGuestWishlistToServer } from '@/composables/useProductFavorite'

type FavItem = {
  id?: number
  product_id?: number
  slug?: string
  title?: string
  description?: string
  price?: number
  base_price?: number
  skus?: { id?: number }[]
  guest?: boolean
}

const { t } = useI18n()
const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
const { adding, addMessage, addError, addProduct: addProductToCart } = useAddToCart()
const favorites = ref<FavItem[]>([])
const loading = ref(false)
const message = ref('')
const error = ref('')
const removing = ref(false)

function productLink(item: FavItem) {
  if (item.slug) return productDetailBySlug(item.slug)
  const id = item.product_id ?? item.id
  if (id == null) return undefined
  return productDetailLink(id)
}

function guestAsFav(): FavItem[] {
  return readGuestWishlist().map((g) => ({
    id: g.productId,
    product_id: g.productId,
    slug: g.slug,
    title: g.title,
    price: g.price,
    base_price: g.basePrice,
    skus: g.skuId ? [{ id: g.skuId }] : undefined,
    guest: true,
  }))
}

async function loadFavorites() {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    if (!isAuthenticated.value) {
      favorites.value = guestAsFav()
      return
    }
    const { data } = await wishlistApi.list()
    favorites.value = (data?.results as FavItem[]) ?? (Array.isArray(data) ? (data as FavItem[]) : [])
  } catch (e: unknown) {
    const err = e as { response?: { data?: { detail?: string } } }
    error.value = err?.response?.data?.detail ?? t('buyerXp.favorites.couldNotLoad')
  } finally {
    loading.value = false
  }
}

async function addToCart(item: FavItem) {
  if (!item.product_id && !item.id) return
  message.value = ''
  error.value = ''
  const ok = await addProductToCart({
    id: item.product_id ?? item.id,
    title: item.title,
    base_price: item.price ?? item.base_price,
    skus: item.skus,
  })
  if (ok) message.value = addMessage.value
  else error.value = addError.value
}

async function remove(item: FavItem) {
  const productId = item.product_id ?? item.id
  if (productId == null) return
  removing.value = true
  message.value = ''
  error.value = ''
  try {
    if (item.guest || !isAuthenticated.value) {
      removeGuestWishlistItem(productId)
      await loadFavorites()
      return
    }
    if (!item.id) return
    await wishlistApi.remove(item.id)
    await loadFavorites()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { detail?: string } } }
    error.value = err?.response?.data?.detail ?? t('buyerXp.favorites.couldNotRemove')
  } finally {
    removing.value = false
  }
}

watch(isAuthenticated, async (authed) => {
  if (authed) await syncGuestWishlistToServer()
  await loadFavorites()
})

onMounted(loadFavorites)
</script>
