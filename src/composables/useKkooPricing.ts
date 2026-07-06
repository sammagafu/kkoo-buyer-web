import { ref } from 'vue'
import client from '@/api/client'
import {
  DEFAULT_KKOO_PRICING,
  normalizeKkooPricingConfig,
  setKkooPricingConfig,
  type KkooPricingConfig,
} from '@/utils/kkooPricing'
import { mapKkooPricingResponse, type KkooPricingApiResponse } from '@/utils/kkooPricingApi'

const config = ref<KkooPricingConfig>({ ...DEFAULT_KKOO_PRICING })
let loadPromise: Promise<KkooPricingConfig> | null = null

export function useKkooPricing() {
  async function load() {
    if (loadPromise) return loadPromise
    loadPromise = (async () => {
      try {
        const { data } = await client.get<KkooPricingApiResponse>('/public/pricing/', {
          validateStatus: (status) => status === 200 || status === 404 || status >= 500,
        })
        if (data && typeof data === 'object') {
          const next = mapKkooPricingResponse(data)
          config.value = next
          setKkooPricingConfig(next)
          return next
        }
      } catch {
        // Fall back to built-in defaults below.
      }
      config.value = normalizeKkooPricingConfig(DEFAULT_KKOO_PRICING)
      setKkooPricingConfig(config.value)
      return config.value
    })()
    return loadPromise
  }

  return { config, load }
}
