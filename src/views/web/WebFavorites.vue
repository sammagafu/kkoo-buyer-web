<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.favorites.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.favorites.savedCount', favorites.length) }}</p>
    </header>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-if="message" class="buyer-xp-toast buyer-xp-toast--ok">{{ message }}</p>
    <p v-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-if="favorites.length" class="buyer-hub-list">
      <article v-for="item in favorites" :key="String(item.id)" class="buyer-detail-card">
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
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { wishlistApi, cartApi } from '@/api'
import { formatBuyerMoney } from '@/utils/buyerFormat'
import { productDetailBySlug, productDetailLink } from '@/utils/buyerDetailLinks'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'

type FavItem = {
  id?: number
  product_id?: number
  slug?: string
  title?: string
  description?: string
  price?: number
  base_price?: number
  skus?: { id?: number }[]
}

const { t } = useI18n()
const favorites = ref<FavItem[]>([])
const loading = ref(false)
const message = ref('')
const error = ref('')
const adding = ref(false)
const removing = ref(false)

function productLink(item: FavItem) {
  if (item.slug) return productDetailBySlug(item.slug)
  const id = item.product_id ?? item.id
  if (id == null) return undefined
  return productDetailLink(id)
}

async function loadFavorites() {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
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
  adding.value = true
  message.value = ''
  error.value = ''
  try {
    const skuId = item.skus?.[0]?.id ?? item.product_id ?? item.id
    await cartApi.add(Number(skuId), 1)
    message.value = t('buyerXp.common.addedToCartShort')
  } catch (e: unknown) {
    const err = e as { response?: { data?: { detail?: string } } }
    error.value = err?.response?.data?.detail ?? t('buyerXp.common.couldNotAdd')
  } finally {
    adding.value = false
  }
}

async function remove(item: FavItem) {
  if (!item.id) return
  removing.value = true
  message.value = ''
  error.value = ''
  try {
    await wishlistApi.remove(item.id)
    await loadFavorites()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { detail?: string } } }
    error.value = err?.response?.data?.detail ?? t('buyerXp.favorites.couldNotRemove')
  } finally {
    removing.value = false
  }
}

onMounted(loadFavorites)
</script>
