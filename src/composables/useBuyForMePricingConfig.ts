import { ref } from 'vue'
import { buyForMeApi } from '@/api/buyForMe'
import {
  DEFAULT_BUY_FOR_ME_PRICING,
  setBuyForMePricingConfig,
  type BuyForMePricingConfig,
} from '@/utils/buyForMePricing'

const config = ref<BuyForMePricingConfig>({ ...DEFAULT_BUY_FOR_ME_PRICING })
let loadPromise: Promise<BuyForMePricingConfig> | null = null

export function useBuyForMePricingConfig() {
  async function load() {
    if (loadPromise) return loadPromise
    loadPromise = (async () => {
      try {
        const { data } = await buyForMeApi.getPricing()
        const next: BuyForMePricingConfig = {
          freeRadiusMeters: data.free_radius_meters ?? DEFAULT_BUY_FOR_ME_PRICING.freeRadiusMeters,
          perKmSurchargeTzs:
            data.per_km_surcharge_tzs ?? DEFAULT_BUY_FOR_ME_PRICING.perKmSurchargeTzs,
        }
        config.value = next
        setBuyForMePricingConfig(next)
        return next
      } catch {
        config.value = { ...DEFAULT_BUY_FOR_ME_PRICING }
        setBuyForMePricingConfig(config.value)
        return config.value
      }
    })()
    return loadPromise
  }

  return { config, load }
}
