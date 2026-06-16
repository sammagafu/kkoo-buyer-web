<template>
  <MarketingLayout>
    <section class="lp-section web-fav-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-fav-grid">
          <div>
            <p class="web-fav-kicker">Favorites</p>
            <h1 class="web-fav-title">Your saved items on web.</h1>
            <p class="web-fav-copy">Signed-in users can view and add wishlist items to the web cart and then check out.</p>
          </div>
          <div class="web-fav-hero-card">
            <p class="small mb-0 text-muted">Items: {{ favorites.length }}</p>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <b-alert v-if="!auth.isAuthenticated" variant="warning" show class="web-fav-auth-alert">
          <p class="mb-3 mb-md-0">Sign in with your KKOO Account to view and manage saved items.</p>
          <KkooAccountButton variant="primary" size="sm" redirect-from="/favorites" force-sign-in />
        </b-alert>
        <div v-else class="fav-grid">
          <article v-for="item in favorites" :key="item.id" class="fav-card">
            <h3 class="mb-1">{{ item.title || 'Product' }}</h3>
            <p class="text-muted small mb-2">{{ item.description || 'Saved item' }}</p>
            <p class="fw-bold mb-2">{{ formatPrice(item.price ?? item.base_price) }}</p>
            <div class="d-flex gap-2">
              <b-button size="sm" variant="primary" :disabled="adding" @click="addToCart(item)">
                Add to cart
              </b-button>
              <b-button size="sm" variant="outline-danger" :disabled="removing" @click="remove(item)">
                Remove
              </b-button>
            </div>
          </article>
          <p v-if="favorites.length === 0" class="text-muted">No favorites yet.</p>
          <p v-if="message" class="text-success small mt-2 mb-0">{{ message }}</p>
          <p v-if="error" class="text-danger small mt-2 mb-0">{{ error }}</p>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import KkooAccountButton from '@/components/auth/KkooAccountButton.vue'
import { wishlistApi, cartApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

type FavItem = { id?: number; product_id?: number; title?: string; description?: string; price?: number; base_price?: number; skus?: { id?: number }[] }

const auth = useAuthStore()
const favorites = ref<FavItem[]>([])
const message = ref('')
const error = ref('')
const adding = ref(false)
const removing = ref(false)

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

async function loadFavorites() {
  message.value = ''
  error.value = ''
  try {
    const { data } = await wishlistApi.list()
    favorites.value = (data?.results as FavItem[]) ?? (Array.isArray(data) ? (data as FavItem[]) : [])
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? 'Could not load favorites.'
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
    message.value = 'Added to cart.'
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? 'Could not add to cart.'
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
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? 'Could not remove favorite.'
  } finally {
    removing.value = false
  }
}

onMounted(() => {
  if (auth.isAuthenticated) loadFavorites()
})
</script>

<style scoped>
.web-fav-hero {
  background:
    radial-gradient(circle at 22% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 82% 12%, rgba(247, 168, 41, 0.14), transparent 28%);
}
.web-fav-grid {
  display: grid;
  gap: 1.5rem;
}
.web-fav-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.web-fav-title {
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.05;
  margin: 0.6rem 0 0.7rem;
}
.web-fav-copy {
  max-width: 60ch;
  color: var(--bs-secondary-color);
  line-height: 1.7;
}
.web-fav-hero-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 1.25rem;
  box-shadow: 0 16px 36px rgba(35, 20, 46, 0.12);
}
.fav-grid {
  display: grid;
  gap: 0.75rem;
}
.fav-card {
  border: 1px solid rgba(92, 48, 143, 0.12);
  border-radius: 1rem;
  padding: 0.9rem;
  background: #fff;
  display: grid;
  gap: 0.25rem;
}
.web-fav-auth-alert {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}
@media (min-width: 768px) {
  .web-fav-auth-alert {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
