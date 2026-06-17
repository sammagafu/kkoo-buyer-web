<template>
  <div class="buyer-xp buyer-xp--wide">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.pharmacy.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.pharmacy.meta') }}</p>
    </header>

    <section class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.pharmacy.healthServices')" :overline="t('buyerXp.pharmacy.overline')" />
      <div class="buyer-hub-list">
        <BuyerHubCard
          :title="t('buyerXp.pharmacy.shopMedicines')"
          :subtitle="t('buyerXp.pharmacy.shopMedicinesSub')"
          icon="solar:health-bold"
          tone="teal"
          @click="viewMode = 'store'"
        />
        <BuyerHubCard
          :title="t('buyerXp.pharmacy.reminders')"
          :subtitle="t('buyerXp.pharmacy.remindersSub')"
          icon="solar:alarm-bold"
          tone="teal"
          :to="{ name: 'buyer.pharmacy.reminders' }"
        />
        <BuyerHubCard
          :title="t('buyerXp.pharmacy.uploadRx')"
          :subtitle="t('buyerXp.pharmacy.uploadRxSub')"
          icon="solar:document-add-bold"
          tone="primary"
          @click="showUpload = true"
        />
        <BuyerHubCard
          :title="t('buyerXp.pharmacy.deliveryRequest')"
          :subtitle="t('buyerXp.pharmacy.deliveryRequestSub')"
          icon="solar:delivery-bold"
          tone="orange"
          :to="{ name: 'buyer.send', query: { category: 'pharmacy' } }"
        />
      </div>
    </section>

    <section v-if="viewMode === 'store'" class="buyer-surface" :aria-label="t('buyerXp.pharmacy.medicines')">
      <div class="buyer-page-head__row mb-2">
        <BuyerSectionHeader :title="t('buyerXp.pharmacy.medicines')" />
        <button type="button" class="buyer-page-head__back" @click="viewMode = 'hub'">
          <Icon icon="solar:close-circle-linear" />
        </button>
      </div>
      <BuyerSearchBar v-model="search" :placeholder="t('buyerXp.pharmacy.searchPlaceholder')" />
      <BuyerProductGridSection
        class="mt-3"
        :products="products"
        :loading="loading"
        :error="error"
        :adding="adding"
        :add-error="addError"
        @add="addProduct"
      />
    </section>

    <div v-if="showUpload" class="buyer-detail-card mt-3">
      <BuyerSectionHeader :title="t('buyerXp.pharmacy.uploadSection')" />
      <input type="file" accept="image/*,.pdf" @change="onFile" />
      <textarea v-model="rxNotes" class="mt-2" rows="2" :placeholder="t('buyerXp.pharmacy.rxNotesPlaceholder')" style="width:100%;border-radius:0.75rem;padding:0.65rem" />
      <button type="button" class="buyer-ride-bar__btn mt-2" style="position:static" :disabled="uploading" @click="uploadRx">
        {{ uploading ? t('buyerXp.common.uploading') : t('buyerXp.common.upload') }}
      </button>
      <p v-if="uploadMsg" class="buyer-xp-toast buyer-xp-toast--ok mt-2">{{ uploadMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { catalogPublicApi } from '@/api/catalog'
import { pharmacyApi } from '@/api/pharmacy'
import { cartApi } from '@/api/cart'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerHubCard from '@/components/buyer/experience/BuyerHubCard.vue'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerProductGridSection, { type GridProduct } from '@/components/buyer/experience/BuyerProductGridSection.vue'

const PHARMACY_SLUG = 'pharmacy'
const { t } = useI18n()
const auth = useAuthStore()
const refreshBuyerCart = inject<() => Promise<void>>('refreshBuyerCart', async () => {})
const openBuyerCart = inject<() => void>('openBuyerCart', () => {})

const viewMode = ref<'hub' | 'store'>('hub')
const products = ref<GridProduct[]>([])
const search = ref('')
const loading = ref(false)
const error = ref('')
const adding = ref(false)
const addError = ref('')
const showUpload = ref(false)
const rxFile = ref<File | null>(null)
const rxNotes = ref('')
const uploading = ref(false)
const uploadMsg = ref('')

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await catalogPublicApi.listProducts({
      category_slug: PHARMACY_SLUG,
      search: search.value || undefined,
      page_size: 48,
      in_stock: true,
    } as never)
    products.value = (data?.results as GridProduct[]) ?? []
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.pharmacy.couldNotLoadMedicines'))
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

function onFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  rxFile.value = f ?? null
}

async function uploadRx() {
  if (!auth.isAuthenticated || !rxFile.value) return
  uploading.value = true
  uploadMsg.value = ''
  try {
    const fd = new FormData()
    fd.append('file', rxFile.value)
    if (rxNotes.value) fd.append('notes', rxNotes.value)
    await pharmacyApi.uploadPrescription(fd)
    uploadMsg.value = t('buyerXp.pharmacy.rxUploaded')
    showUpload.value = false
  } catch (e) {
    uploadMsg.value = formatApiError(e, t('buyerXp.pharmacy.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

watch(search, () => {
  if (viewMode.value === 'store') void loadProducts()
})

watch(viewMode, (mode) => {
  if (mode === 'store') void loadProducts()
})
</script>
