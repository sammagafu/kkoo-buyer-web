<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.common.back')" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <div>
          <h1 class="buyer-page-head__title">{{ categoryName }}</h1>
          <p class="buyer-page-head__meta">{{ t('buyerXp.category.meta') }}</p>
        </div>
      </div>
    </header>

    <section class="buyer-surface">
      <BuyerSearchBar v-model="search" :placeholder="t('buyerXp.category.searchPlaceholder')" />
      <BuyerProductGridSection
        :products="displayProducts"
        :loading="loading"
        :error="error"
        :adding="adding"
        :add-error="addError"
        @add="addProduct"
      />
      <p v-if="addMessage" class="buyer-xp-toast buyer-xp-toast--ok mt-2">{{ addMessage }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { catalogPublicApi } from '@/api/catalog'
import { formatApiError } from '@/utils/formatApiError'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerProductGridSection, { type GridProduct } from '@/components/buyer/experience/BuyerProductGridSection.vue'
import { useAddToCart } from '@/composables/useAddToCart'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { adding, addError, addMessage, addProduct: addProductToCart } = useAddToCart()

const categoryName = ref('')
const products = ref<GridProduct[]>([])
const search = ref('')
const loading = ref(false)
const error = ref('')

const displayProducts = computed(() => {
  if (!search.value.trim()) return products.value
  const q = search.value.toLowerCase()
  return products.value.filter(
    (p) =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q),
  )
})

async function load() {
  const slug = props.slug || String(route.params.slug ?? '')
  loading.value = true
  error.value = ''
  try {
    const { data: cats } = await catalogPublicApi.listCategories()
    const list = (cats as { results?: { slug?: string; name?: string }[] })?.results ?? []
    const match = list.find((c) => c.slug === slug)
    categoryName.value = match?.name || slug.replace(/-/g, ' ')
    const { data } = await catalogPublicApi.listProducts({
      category_slug: slug,
      page_size: 48,
      in_stock: true,
    } as never)
    products.value = ((data as { results?: GridProduct[] })?.results ?? []) as GridProduct[]
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.category.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function addProduct(prod: GridProduct) {
  await addProductToCart(prod)
}

onMounted(load)
</script>
