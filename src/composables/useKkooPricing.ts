import { ref } from 'vue'
import client from '@/api/client'
import {
  DEFAULT_KKOO_PRICING,
  normalizeKkooPricingConfig,
  setKkooPricingConfig,
  type KkooPricingConfig,
} from '@/utils/kkooPricing'
import { mapKkooPricingResponse, type KkooPricingApiResponse } from '@/utils/kkooPricingApi'

/**
 * Where the active pricing numbers came from. Marketing calculators must only
 * present amounts when the platform published them ('live'); built-in defaults
 * exist so dependent math never crashes, not for display as fact.
 */
export type KkooPricingSource = 'pending' | 'live' | 'fallback'

const config = ref<KkooPricingConfig>({ ...DEFAULT_KKOO_PRICING })
const source = ref<KkooPricingSource>('pending')
let loadPromise: Promise<KkooPricingConfig> | null = null

export function useKkooPricing() {
  async function load() {
    if (loadPromise) return loadPromise
    loadPromise = (async () => {
      try {
        const res = await client.get<KkooPricingApiResponse>('/public/pricing/', {
          validateStatus: (status) => status === 200 || status === 404 || status >= 500,
        })
        // Live only on a 200 whose body carries the rider economics block —
        // 404/5xx bodies must not be dressed up as published rates.
        if (res.status === 200 && res.data && typeof res.data === 'object' && res.data.rider) {
          const next = mapKkooPricingResponse(res.data)
          config.value = next
          setKkooPricingConfig(next)
          source.value = 'live'
          return next
        }
      } catch {
        // Fall back to built-in defaults below.
      }
      config.value = normalizeKkooPricingConfig(DEFAULT_KKOO_PRICING)
      setKkooPricingConfig(config.value)
      source.value = 'fallback'
      return config.value
    })()
    return loadPromise
  }

  return { config, source, load }
}
