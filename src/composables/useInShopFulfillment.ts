import { computed, ref, watch } from 'vue'
import type { FulfillmentModeId } from '@/components/buyer/BuyerFulfillmentBar.vue'

const STORAGE_KEY = 'kkoo_fulfillment_mode'

const fulfillmentMode = ref<FulfillmentModeId>('delivery')

function readStored(): FulfillmentModeId {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw === 'pickup' || raw === 'delivery' || raw === 'dine_in') return raw
  } catch {
    /* ignore */
  }
  return 'delivery'
}

fulfillmentMode.value = readStored()

watch(fulfillmentMode, (mode) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
})

export function useInShopFulfillment() {
  const isLocalPickup = computed(() => fulfillmentMode.value === 'pickup')
  const isOnlineDelivery = computed(() => fulfillmentMode.value === 'delivery')
  const isDineIn = computed(() => fulfillmentMode.value === 'dine_in')

  return {
    fulfillmentMode,
    isLocalPickup,
    isOnlineDelivery,
    isDineIn,
  }
}

/** @deprecated Use useInShopFulfillment */
export function usePharmacyFulfillment() {
  return useInShopFulfillment()
}
