<template>
  <div class="shop-main shop-main--simple send-main">
    <header class="shop-top send-main__head">
      <p class="send-main__crumb">{{ t('buyerXp.send.crumb') }}</p>
      <h1 class="shop-top__title">{{ t('buyerXp.send.title') }}</h1>
    </header>

    <div v-if="!auth.isAuthenticated" class="send-main__auth">
      <p>{{ t('buyerXp.send.signInPrompt') }}</p>
      <RouterLink :to="{ name: 'auth.sign-in', query: { redirectedFrom: '/send' } }" class="send-main__auth-btn">
        {{ t('buyerXp.common.signIn') }}
      </RouterLink>
    </div>

    <template v-else>
      <div v-if="storeBanner" class="send-intro send-intro--store">
        <Icon icon="solar:shop-bold" aria-hidden="true" />
        <div>
          <p class="send-intro__kicker">{{ t('buyerXp.send.shoppingFrom') }}</p>
          <p class="send-intro__title">{{ storeBanner }}</p>
        </div>
      </div>
      <div v-else class="send-intro send-intro--hero">
        <Icon icon="solar:bag-heart-bold" class="send-intro__hero-icon" aria-hidden="true" />
        <div>
          <p class="send-intro__title">{{ t('buyerXp.send.heroTitle') }}</p>
          <p class="send-intro__body">
            {{ t('buyerXp.send.heroBody') }}
          </p>
        </div>
      </div>

      <BuyForMeVerticalStrip v-model="categoryId" />

      <BuyForMeDeliverySection
        v-model:delivery-address="deliveryAddress"
        v-model:phone="phone"
        v-model:notes="notes"
        @coords="onCoords"
      />

      <div class="send-items-head">
        <h2 class="send-items-head__title">{{ t('buyerXp.send.yourItems') }}</h2>
        <button type="button" class="send-items-head__add" @click="addItem">
          <Icon icon="solar:add-circle-linear" aria-hidden="true" />
          {{ t('buyerXp.send.addItem') }}
        </button>
      </div>
      <p class="send-items-head__hint">{{ t('buyerXp.send.itemsHint') }}</p>

      <BuyForMeItemEditor
        v-for="(item, index) in items"
        :key="item.key"
        :index="index"
        :item="item"
        :can-remove="items.length > 1"
        @remove="removeItem(index)"
        @pick="openPicker(index)"
        @quantity="(q) => setQuantity(index, q)"
        @update-name="(v) => updateItemName(index, v)"
        @update-price="(v) => updateItemPrice(index, v)"
      />

      <BuyForMeTotalStrip
        :items-subtotal="itemsSubtotal"
        :delivery-fee="deliveryFee"
        :total-savings="totalSavings"
        :estimated-total="budgetTotal"
      />

      <section v-if="recentRequests.length" class="send-recent" :aria-label="t('buyerXp.send.myRequests')">
        <h2 class="send-recent__title">{{ t('buyerXp.send.myRequests') }}</h2>
        <ul class="send-recent__list">
          <li v-for="req in recentRequests" :key="req.id" class="send-recent__card">
            <div class="send-recent__card-top">
              <p class="send-recent__name">{{ req.title || t('buyerXp.send.requestFallback') }}</p>
              <span class="send-recent__status">{{ formatStatus(req.status) }}</span>
            </div>
            <p class="send-recent__route">{{ req.shopping_area }} → {{ req.delivery_address }}</p>
            <div class="send-recent__card-foot">
              <span v-if="req.budget_amount" class="send-recent__amount">{{ formatPrice(req.budget_amount) }}</span>
              <button
                v-if="req.status === 'priced' && req.id"
                type="button"
                class="send-recent__approve"
                :disabled="approvingId === req.id"
                @click="approveRequest(req.id!)"
              >
                {{ approvingId === req.id ? t('buyerXp.send.approving') : t('buyerXp.send.holdApprove') }}
              </button>
            </div>
          </li>
        </ul>
      </section>

      <p v-if="error" class="shop-products__toast shop-products__toast--err send-main__toast">{{ error }}</p>

      <footer class="send-main__footer">
        <button type="button" class="send-main__submit" :disabled="submitting" @click="submit">
          {{ submitting ? t('buyerXp.send.sending') : t('buyerXp.send.sendRequest') }}
        </button>
      </footer>
    </template>

    <BuyForMeProductPicker
      v-model="pickerOpen"
      :delivery-lat="queryLat"
      :delivery-lng="queryLng"
      :preferred-seller-id="preferredSellerId"
      @select="onProductPicked"
    />

    <Teleport to="body">
      <div v-if="successModal" class="send-success-modal" role="dialog" aria-modal="true">
        <div class="send-success-modal__card">
          <Icon icon="solar:check-circle-bold" class="send-success-modal__icon" aria-hidden="true" />
          <h2>{{ t('buyerXp.send.requestSent') }}</h2>
          <p>{{ t('buyerXp.send.requestSentBody') }}</p>
          <div class="send-success-modal__actions">
            <button type="button" class="send-success-modal__primary" @click="successModal = false">{{ t('buyerXp.common.done') }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { buyForMeApi, type BuyForMeRequest } from '@/api/buyForMe'
import { logisticsPublicApi } from '@/api/logistics'
import { formatApiError } from '@/utils/formatApiError'
import { buyForMeCategoryById, type BuyForMeCategoryId } from '@/constants/buyForMeCategories'
import {
  lineUnitTotal,
  newItemDraft,
  type BuyForMeItemDraft,
  type BuyForMeProductSelection,
} from '@/types/buyForMe'
import BuyForMeVerticalStrip from '@/components/buyer/send/BuyForMeVerticalStrip.vue'
import BuyForMeDeliverySection from '@/components/buyer/send/BuyForMeDeliverySection.vue'
import BuyForMeItemEditor from '@/components/buyer/send/BuyForMeItemEditor.vue'
import BuyForMeTotalStrip from '@/components/buyer/send/BuyForMeTotalStrip.vue'
import BuyForMeProductPicker from '@/components/buyer/send/BuyForMeProductPicker.vue'
import { useBuyForMePricingConfig } from '@/composables/useBuyForMePricingConfig'

const FALLBACK_LAT = -6.8172
const FALLBACK_LNG = 39.2833

const route = useRoute()
const auth = useAuthStore()
const { t } = useI18n()
const { load: loadBuyForMePricing } = useBuyForMePricingConfig()

const categoryId = ref<BuyForMeCategoryId>('grocery')
const items = ref<BuyForMeItemDraft[]>([newItemDraft('grocery')])
const deliveryAddress = ref('')
const phone = ref('')
const notes = ref('')
const deliveryLat = ref<number | null>(null)
const deliveryLng = ref<number | null>(null)
const deliveryFee = ref(0)
const submitting = ref(false)
const error = ref('')
const successModal = ref(false)
const recentRequests = ref<BuyForMeRequest[]>([])
const pickerOpen = ref(false)
const pickerItemIndex = ref(0)
const approvingId = ref<number | null>(null)

const storeBanner = ref('')
const preferredSellerId = ref<number | null>(null)

const queryLat = computed(() => deliveryLat.value ?? FALLBACK_LAT)
const queryLng = computed(() => deliveryLng.value ?? FALLBACK_LNG)

const itemsSubtotal = computed(() =>
  items.value.reduce((sum, item) => sum + lineUnitTotal(item) * Math.max(1, item.quantity), 0),
)

const totalSavings = computed(() =>
  items.value.reduce((sum, item) => {
    const savings = item.selection?.savingsAmount ?? 0
    return sum + savings * Math.max(1, item.quantity)
  }, 0),
)

const budgetTotal = computed(() => itemsSubtotal.value + deliveryFee.value)

function formatPrice(val?: number | null) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(val)
}

function formatStatus(status?: string) {
  return (status || 'searching').replace(/_/g, ' ')
}

function toE164(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('255')) return `+${digits}`
  if (digits.startsWith('0')) return `+255${digits.slice(1)}`
  return `+255${digits}`
}

function onCategoryChange(id: BuyForMeCategoryId) {
  for (const item of items.value) item.categoryId = id
}

watch(categoryId, onCategoryChange)

function onCoords(lat: number | null, lng: number | null) {
  deliveryLat.value = lat
  deliveryLng.value = lng
  void refreshDeliveryFee()
}

async function refreshDeliveryFee() {
  try {
    const { data } = await logisticsPublicApi.deliveryQuote({ base_fee: 5000 })
    deliveryFee.value = data?.total_fee ?? data?.base_fee ?? 5000
  } catch {
    deliveryFee.value = 5000
  }
}

function addItem() {
  items.value.push(newItemDraft(categoryId.value))
}

function removeItem(index: number) {
  items.value.splice(index, 1)
}

function setQuantity(index: number, qty: number) {
  items.value[index].quantity = Math.max(1, qty)
}

function updateItemName(index: number, name: string) {
  items.value[index].name = name
}

function updateItemPrice(index: number, price: number) {
  items.value[index].price = price
}

function openPicker(index: number) {
  pickerItemIndex.value = index
  pickerOpen.value = true
}

function onProductPicked(selection: BuyForMeProductSelection) {
  const item = items.value[pickerItemIndex.value]
  if (!item) return
  item.selection = selection
  item.name = selection.productTitle
  item.price = selection.lineTotal
}

function buildPayload() {
  const apiItems: Record<string, unknown>[] = []
  for (const item of items.value) {
    const name = item.selection?.productTitle || item.name.trim()
    if (!name) continue
    const cat = buyForMeCategoryById(item.categoryId)
    const price = lineUnitTotal(item)
    const row: Record<string, unknown> = {
      description: name,
      title: name,
      quantity: Math.max(1, item.quantity),
      source: cat.apiSource,
      expected_price: price,
      preferred_details: cat.id,
    }
    if (item.selection) {
      const sel = item.selection
      if (sel.productId) row.product_id = sel.productId
      if (sel.sellerId) row.seller_id = sel.sellerId
      if (sel.storeName) row.store_name = sel.storeName
      row.distance_meters = sel.distanceMeters
      row.distance_surcharge = sel.distanceSurcharge
      if (sel.storeSlug) row.store_slug = sel.storeSlug
      if (sel.savingsAmount && sel.savingsAmount > 0) {
        row.savings_amount = sel.savingsAmount
        if (sel.compareAtTotal != null) row.compare_at_total = sel.compareAtTotal
      }
    }
    apiItems.push(row)
  }

  const primaryCat = buyForMeCategoryById(categoryId.value)
  const shoppingArea = storeBanner.value.trim() || primaryCat.shoppingArea
  const names = apiItems.map((e) => String(e.title))
  const title = storeBanner.value
    ? names.length === 1
      ? `${storeBanner.value} · ${names[0]}`
      : `${storeBanner.value} · ${names.length} items`
    : names.length === 1
      ? names[0]
      : `Send me · ${names.length} items`

  return {
    title,
    shopping_area: shoppingArea,
    budget_amount: budgetTotal.value,
    delivery_address: deliveryAddress.value.trim(),
    delivery_lat: deliveryLat.value ?? undefined,
    delivery_lng: deliveryLng.value ?? undefined,
    preferred_contact_phone: toE164(phone.value),
    notes: notes.value.trim(),
    items: apiItems,
  }
}

async function submit() {
  error.value = ''
  const payload = buildPayload()
  if (!payload.items.length) {
    error.value = t('buyerXp.send.addProductFirst')
    return
  }
  if (!payload.delivery_address) {
    error.value = t('buyerXp.send.addressRequired')
    return
  }
  if (!payload.preferred_contact_phone) {
    error.value = t('buyerXp.send.phoneRequired')
    return
  }

  submitting.value = true
  try {
    await buyForMeApi.create(payload as never)
    successModal.value = true
    items.value = [newItemDraft(categoryId.value)]
    notes.value = ''
    await loadRecent()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.send.couldNotSubmit'))
  } finally {
    submitting.value = false
  }
}

async function approveRequest(id: number) {
  approvingId.value = id
  try {
    await buyForMeApi.hold(id)
    await buyForMeApi.approve(id)
    await loadRecent()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.send.couldNotApprove'))
  } finally {
    approvingId.value = null
  }
}

async function loadRecent() {
  try {
    const { data } = await buyForMeApi.list()
    const list = Array.isArray(data) ? data : (data?.results ?? [])
    recentRequests.value = (list as BuyForMeRequest[]).slice(0, 8)
  } catch {
    recentRequests.value = []
  }
}

onMounted(() => {
  const u = auth.user as { phone_number?: string } | null
  if (u?.phone_number) phone.value = u.phone_number.replace(/^\+255/, '')

  const cat = String(route.query.category ?? '').trim()
  if (cat === 'food' || cat === 'grocery' || cat === 'pharmacy' || cat === 'store') {
    categoryId.value = cat
    items.value = [newItemDraft(cat)]
  }

  const store = String(route.query.store ?? route.query.store_name ?? '').trim()
  if (store) storeBanner.value = store

  const seller = Number(route.query.seller_id ?? route.query.seller)
  if (Number.isFinite(seller) && seller > 0) preferredSellerId.value = seller

  const itemName = String(route.query.item ?? route.query.q ?? '').trim()
  if (itemName) items.value[0].name = itemName

  void refreshDeliveryFee()
  void loadBuyForMePricing()
  if (auth.isAuthenticated) void loadRecent()
})
</script>
