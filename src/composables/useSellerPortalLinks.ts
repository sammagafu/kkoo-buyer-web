import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ROLES } from '@/acl'
import { useAuthStore } from '@/stores/auth'
import {
  bizCrmUrl,
  bizSellerAccountUrl,
  bizSellerDashboardUrl,
  bizSellerRegisterUrl,
} from '@/config/landing-links'

/** Biz web `/` redirects to sign-in — always link to a concrete seller/CRM route. */
export const sellerDashboardHref = bizSellerDashboardUrl
export const sellerAccountHref = bizSellerAccountUrl
export const crmPortalHref = bizCrmUrl

export function useSellerPortalLinks() {
  const auth = useAuthStore()
  const { isAuthenticated, availableAccountRoles } = storeToRefs(auth)

  const hasSellerRole = computed(() => availableAccountRoles.value.includes(ROLES.SELLER))
  const hasCrmRole = computed(() => availableAccountRoles.value.includes(ROLES.CRM_MEMBER))

  /** Signed-in seller or CRM member → correct biz portal; otherwise null (use seller register). */
  const portalHref = computed(() => {
    if (!isAuthenticated.value) return null
    if (hasSellerRole.value) return sellerAccountHref
    if (hasCrmRole.value) return crmPortalHref
    return null
  })

  const sellerRegisterHref = computed(() => bizSellerRegisterUrl)

  return {
    sellerDashboardHref,
    sellerAccountHref,
    crmPortalHref,
    portalHref,
    sellerRegisterHref,
    hasSellerRole,
    hasCrmRole,
  }
}
