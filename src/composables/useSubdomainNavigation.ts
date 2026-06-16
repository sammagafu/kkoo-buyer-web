/**
 * Navigate to buyer verticals within this SPA (path-based, not subdomains).
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { subdomainConfig } from '@/config/subdomains'

type ServiceType = 'eats' | 'stay' | 'ride' | 'market'

const SERVICE_ROUTES: Record<ServiceType, { name: string }> = {
  market: { name: 'buyer.marketplace' },
  eats: { name: 'buyer.eats' },
  stay: { name: 'buyer.booking' },
  ride: { name: 'buyer.ride' },
}

const SERVICE_PATHS: Record<ServiceType, string> = {
  market: '/marketplace',
  eats: '/eats',
  stay: '/booking',
  ride: '/ride',
}

export function useSubdomainNavigation() {
  const router = useRouter()

  const getServiceUrl = (service: ServiceType): string => SERVICE_PATHS[service]

  const navigateToService = (
    service: ServiceType,
    options: { newWindow?: boolean; path?: string } = {},
  ) => {
    const route = SERVICE_ROUTES[service]
    if (options.newWindow) {
      const resolved = router.resolve(route)
      window.open(`${resolved.href}${options.path ?? ''}`, '_blank')
      return
    }
    void router.push(route)
  }

  const getServiceInfo = (service: ServiceType) => subdomainConfig.getServiceInfo(service)

  const allServices = computed(() => subdomainConfig.getAllServices())

  const isExternalSubdomain = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://')
  }

  const getLinkHref = (service: ServiceType): string => getServiceUrl(service)

  return {
    getServiceUrl,
    navigateToService,
    getServiceInfo,
    allServices,
    isExternalSubdomain,
    getLinkHref,
  }
}
