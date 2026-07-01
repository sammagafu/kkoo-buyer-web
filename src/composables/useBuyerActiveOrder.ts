import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ordersUserApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const ACTIVE_STATUSES = new Set(['pending', 'confirmed', 'processing', 'shipped', 'in_transit', 'picked_up', 'on_the_way'])

type OrderRow = {
  id?: number | string
  order_number?: string
  status?: string
  title?: string
}

export function useBuyerActiveOrder() {
  const auth = useAuthStore()
  const { isAuthenticated } = storeToRefs(auth)
  const activeOrder = ref<OrderRow | null>(null)
  const loading = ref(false)

  async function load() {
    if (!isAuthenticated.value) {
      activeOrder.value = null
      return
    }
    loading.value = true
    try {
      const { data } = await ordersUserApi.list({ page_size: 20 })
      const list = Array.isArray(data) ? data : ((data as { results?: OrderRow[] })?.results ?? [])
      activeOrder.value =
        list.find((o) => ACTIVE_STATUSES.has(String(o.status ?? '').toLowerCase())) ?? null
    } catch {
      activeOrder.value = null
    } finally {
      loading.value = false
    }
  }

  const hasActiveOrder = computed(() => Boolean(activeOrder.value?.id))

  onMounted(() => {
    void load()
  })

  return { activeOrder, hasActiveOrder, loading, reload: load }
}
