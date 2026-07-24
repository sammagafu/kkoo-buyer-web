<template>
  <div class="buyer-xp buyer-xp--wide buyer-xp--pharmacy">
    <template v-if="viewMode === 'hub'">
      <header class="buyer-page-head">
        <h1 class="buyer-page-head__title">{{ t('buyerXp.pharmacy.title') }}</h1>
        <p class="buyer-page-head__meta">{{ t('buyerXp.pharmacy.meta') }}</p>
      </header>

      <section class="buyer-surface">
        <BuyerSectionHeader :title="t('buyerXp.pharmacy.healthServices')" :overline="t('buyerXp.pharmacy.overline')" />
        <div class="buyer-hub-list buyer-hub-list--grid">
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

      <section v-if="showUpload" class="buyer-surface buyer-pharmacy-upload">
        <BuyerSectionHeader :title="t('buyerXp.pharmacy.uploadSection')" />
        <input type="file" accept="image/*,.pdf" class="buyer-pharmacy-upload__file" @change="onFile" />
        <textarea
          v-model="rxNotes"
          class="buyer-pharmacy-upload__notes"
          rows="2"
          :placeholder="t('buyerXp.pharmacy.rxNotesPlaceholder')"
        />
        <button type="button" class="buyer-ride-bar__btn buyer-pharmacy-upload__submit" :disabled="uploading" @click="uploadRx">
          {{ uploading ? t('buyerXp.common.uploading') : t('buyerXp.common.upload') }}
        </button>
        <p v-if="uploadMsg" class="buyer-xp-toast buyer-xp-toast--ok mt-2">{{ uploadMsg }}</p>
      </section>
    </template>

    <template v-else>
      <header class="buyer-page-head">
        <div class="buyer-page-head__row">
          <button type="button" class="buyer-page-head__back" :aria-label="t('buyerXp.pharmacy.backToHub')" @click="viewMode = 'hub'">
            <Icon icon="solar:arrow-left-linear" />
          </button>
          <div>
            <h1 class="buyer-page-head__title">{{ t('buyerXp.pharmacy.medicines') }}</h1>
            <p class="buyer-page-head__meta">{{ t('buyerXp.pharmacy.shopMedicinesSub') }}</p>
          </div>
        </div>
      </header>

      <section class="buyer-surface buyer-pharmacy-store" :aria-label="t('buyerXp.pharmacy.medicines')">
        <BuyerFulfillmentBar
          v-model="fulfillmentMode"
          :label="t('buyerXp.pharmacy.fulfillmentLabel')"
          :hint="fulfillmentHint"
          :modes="fulfillmentModes"
        />

        <div v-if="isLocalPickup" class="buyer-pharmacy-local-banner">
          <Icon icon="solar:shop-bold" aria-hidden="true" />
          <div>
            <strong>{{ t('buyerXp.pharmacy.localCartTitle') }}</strong>
            <p>{{ t('buyerXp.pharmacy.localCartBody') }}</p>
          </div>
        </div>

        <BuyerSearchBar v-model="search" :placeholder="t('buyerXp.pharmacy.searchPlaceholder')" />

        <div v-if="categoryOptions.length" class="buyer-pharmacy-filters">
          <button
            type="button"
            class="buyer-venue__chip"
            :class="{ 'buyer-venue__chip--primary': activeCategory === 'all' }"
            @click="activeCategory = 'all'; activeSubcategory = 'all'"
          >
            All categories
          </button>
          <button
            v-for="c in categoryOptions"
            :key="c.slug"
            type="button"
            class="buyer-venue__chip"
            :class="{ 'buyer-venue__chip--primary': activeCategory === c.slug }"
            @click="activeCategory = c.slug; activeSubcategory = 'all'"
          >
            {{ c.name }}
          </button>
        </div>
        <div v-if="subcategoryOptions.length" class="buyer-pharmacy-filters">
          <button
            type="button"
            class="buyer-venue__chip"
            :class="{ 'buyer-venue__chip--primary': activeSubcategory === 'all' }"
            @click="activeSubcategory = 'all'"
          >
            All subcategories
          </button>
          <button
            v-for="c in subcategoryOptions"
            :key="c.slug"
            type="button"
            class="buyer-venue__chip"
            :class="{ 'buyer-venue__chip--primary': activeSubcategory === c.slug }"
            @click="activeSubcategory = c.slug"
          >
            {{ c.name }}
          </button>
        </div>
        <div class="buyer-pharmacy-filters">
          <button
            v-for="age in ageOptions"
            :key="age.value"
            type="button"
            class="buyer-venue__chip"
            :class="{ 'buyer-venue__chip--primary': activeAge === age.value }"
            @click="activeAge = age.value"
          >
            {{ age.label }}
          </button>
        </div>
        <div v-if="requirementOptions.length" class="buyer-pharmacy-filters">
          <button
            type="button"
            class="buyer-venue__chip"
            :class="{ 'buyer-venue__chip--primary': activeRequirement === 'all' }"
            @click="activeRequirement = 'all'"
          >
            All needs
          </button>
          <button
            v-for="req in requirementOptions"
            :key="req"
            type="button"
            class="buyer-venue__chip"
            :class="{ 'buyer-venue__chip--primary': activeRequirement === req }"
            @click="activeRequirement = req"
          >
            {{ formatRequirement(req) }}
          </button>
        </div>

        <template v-if="groupedProducts.length">
          <div v-for="group in groupedProducts" :key="group.title" class="buyer-pharmacy-group">
            <h3 class="buyer-pharmacy-group__title">{{ group.title }}</h3>
            <BuyerProductGridSection
              :products="group.products"
              :loading="false"
              :error="''"
              :adding="adding"
              :add-error="addError"
              @add="(p, qty) => addProduct(p, qty)"
            />
          </div>
        </template>
        <BuyerProductGridSection
          v-else
          class="buyer-pharmacy-products"
          :products="filteredProducts"
          :loading="loading"
          :error="error"
          :adding="adding"
          :add-error="addError"
          @add="(p, qty) => addProduct(p, qty)"
        />

        <p v-if="addMessage" class="buyer-xp-toast buyer-xp-toast--ok mt-2">{{ addMessage }}</p>

        <div v-if="itemCount > 0" class="buyer-pharmacy-checkout-row">
          <RouterLink :to="checkoutLink" class="buyer-venue__chip buyer-venue__chip--primary buyer-venue__chip--lg">
            {{ isLocalPickup ? t('buyerXp.pharmacy.checkoutPickup') : t('buyerXp.pharmacy.checkoutDelivery') }}
          </RouterLink>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { catalogPublicApi } from '@/api/catalog'
import { pharmacyApi } from '@/api/pharmacy'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'
import { buildCheckoutLink } from '@/utils/fulfillmentLinks'
import { useWebCart } from '@/composables/useWebCart'
import { useInShopFulfillment } from '@/composables/useInShopFulfillment'
import { useAddToCart } from '@/composables/useAddToCart'
import BuyerFulfillmentBar, { type FulfillmentModeOption } from '@/components/buyer/BuyerFulfillmentBar.vue'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerHubCard from '@/components/buyer/experience/BuyerHubCard.vue'
import BuyerSearchBar from '@/components/buyer/experience/BuyerSearchBar.vue'
import BuyerProductGridSection, { type GridProduct } from '@/components/buyer/experience/BuyerProductGridSection.vue'

const PHARMACY_SLUG = 'pharmacy'
const { t } = useI18n()
const auth = useAuthStore()
const { itemCount } = useWebCart()
const { fulfillmentMode, isLocalPickup } = useInShopFulfillment()
const { adding, addError, addMessage, addProduct } = useAddToCart()

const fulfillmentModes: FulfillmentModeOption[] = [
  { id: 'pickup', label: 'Pick up in store', icon: 'solar:shop-bold' },
  { id: 'delivery', label: 'Deliver to me', icon: 'solar:delivery-bold' },
]

const fulfillmentHint = computed(() =>
  isLocalPickup.value ? t('buyerXp.pharmacy.localCartHint') : t('buyerXp.pharmacy.onlineCartHint'),
)

const checkoutLink = computed(() => buildCheckoutLink(fulfillmentMode.value))

type CatNode = { id: number; name: string; slug: string; parent_id?: number | null; children?: CatNode[] }

const viewMode = ref<'hub' | 'store'>('hub')
const products = ref<GridProduct[]>([])
const pharmacyTree = ref<CatNode[]>([])
const search = ref('')
const loading = ref(false)
const error = ref('')
const showUpload = ref(false)
const rxFile = ref<File | null>(null)
const rxNotes = ref('')
const uploading = ref(false)
const uploadMsg = ref('')
const activeCategory = ref('all')
const activeSubcategory = ref('all')
const activeAge = ref('all')
const activeRequirement = ref('all')

const ageOptions = [
  { value: 'all', label: 'All ages' },
  { value: 'infant', label: 'Infant' },
  { value: 'child', label: 'Child' },
  { value: 'adolescent', label: 'Adolescent' },
  { value: 'adult', label: 'Adult' },
  { value: 'elderly', label: 'Elderly' },
]

function formatRequirement(value: string) {
  return value.replace(/_/g, ' ')
}

const pharmacyRoot = computed(() => {
  const roots = pharmacyTree.value
  return roots.find((c) => c.slug === PHARMACY_SLUG) ?? roots[0] ?? null
})

const categoryOptions = computed(() => pharmacyRoot.value?.children ?? [])

const subcategoryOptions = computed(() => {
  if (activeCategory.value === 'all') return []
  const cat = categoryOptions.value.find((c) => c.slug === activeCategory.value)
  return cat?.children ?? []
})

function flattenSlugs(node: CatNode): string[] {
  const out = [node.slug]
  for (const child of node.children ?? []) out.push(...flattenSlugs(child))
  return out
}

const filteredProducts = computed(() => {
  let list = products.value as Array<GridProduct & {
    category_slug?: string
    category_name?: string
    patient_age_group?: string
    patient_requirements?: string[]
  }>

  if (activeSubcategory.value !== 'all') {
    list = list.filter((p) => p.category_slug === activeSubcategory.value)
  } else if (activeCategory.value !== 'all') {
    const cat = categoryOptions.value.find((c) => c.slug === activeCategory.value)
    if (cat) {
      const slugs = new Set(flattenSlugs(cat))
      list = list.filter((p) => (p.category_slug && slugs.has(p.category_slug)) || p.category_name === cat.name)
    }
  }

  if (activeAge.value !== 'all') {
    list = list.filter((p) => {
      const g = (p.patient_age_group || '').toLowerCase()
      return !g || g === 'all_ages' || g === activeAge.value
    })
  }

  if (activeRequirement.value !== 'all') {
    list = list.filter((p) =>
      (p.patient_requirements || []).map((x) => x.toLowerCase()).includes(activeRequirement.value),
    )
  }

  return list
})

const requirementOptions = computed(() => {
  const tags = new Set<string>()
  for (const p of products.value as Array<{ patient_requirements?: string[] }>) {
    for (const tag of p.patient_requirements || []) tags.add(String(tag).toLowerCase())
  }
  return [...tags].sort()
})

const groupedProducts = computed(() => {
  const map = new Map<string, GridProduct[]>()
  for (const p of filteredProducts.value) {
    const title = (p as { category_name?: string }).category_name || 'Medicines'
    if (!map.has(title)) map.set(title, [])
    map.get(title)!.push(p)
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([title, groupProducts]) => ({ title, products: groupProducts }))
})

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    const [prodRes, catRes] = await Promise.all([
      catalogPublicApi.listProducts({
        category: PHARMACY_SLUG,
        search: search.value || undefined,
        page_size: 80,
        in_stock: true,
      } as never),
      catalogPublicApi.listCategories({ kind: 'pharmacy' }),
    ])
    products.value = (prodRes.data?.results as GridProduct[]) ?? []
    pharmacyTree.value = ((catRes.data?.results as CatNode[]) ?? []).map((n) => ({
      ...n,
      children: n.children ?? [],
    }))
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.pharmacy.couldNotLoadMedicines'))
  } finally {
    loading.value = false
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
