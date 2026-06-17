import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ROLES } from '@/acl'
import { BUYER_ACCOUNT_ROLE, useAuthStore, type AccountRole } from '@/stores/auth'
import { adminWebPath, bizWebPath } from '@/config/cross-app-links'

const roleMeta: Record<AccountRole, { label: string; icon: string }> = {
  [BUYER_ACCOUNT_ROLE]: { label: 'Buyer', icon: 'solar:cart-large-2-bold' },
  [ROLES.SELLER]: { label: 'Seller', icon: 'solar:shop-2-bold' },
  [ROLES.ADMIN]: { label: 'Admin', icon: 'solar:shield-user-bold' },
  [ROLES.STAFF]: { label: 'Staff', icon: 'solar:users-group-rounded-bold' },
  [ROLES.CRM_MEMBER]: { label: 'Business team', icon: 'solar:buildings-3-bold' },
}

const roleDefaultRoutes: Record<AccountRole, { name?: string; href?: string }> = {
  [BUYER_ACCOUNT_ROLE]: { name: 'buyer.marketplace' },
  [ROLES.SELLER]: { href: bizWebPath('/seller') },
  [ROLES.ADMIN]: { href: adminWebPath('/dashboard') },
  [ROLES.STAFF]: { href: adminWebPath('/dashboard') },
  [ROLES.CRM_MEMBER]: { href: bizWebPath('/seller/crm') },
}

export function useAccountWorkspaces() {
  const auth = useAuthStore()
  const router = useRouter()
  const { activeAccountRole, availableAccountRoles } = storeToRefs(auth)

  const roleSwitchOptions = computed(() =>
    availableAccountRoles.value.map((role) => ({
      role,
      label: roleMeta[role].label,
      icon: roleMeta[role].icon,
    })),
  )

  const roleAvailability = computed(() => new Set(availableAccountRoles.value))

  const workspaceCards = computed(() => [
    {
      title: 'Buyer account',
      icon: 'solar:user-circle-bold',
      available: true,
      status: activeAccountRole.value === BUYER_ACCOUNT_ROLE ? 'Current' : 'Available',
      role: BUYER_ACCOUNT_ROLE,
      cta: 'Open buyer',
    },
    {
      title: 'Seller workspace',
      icon: 'solar:shop-2-bold',
      available: roleAvailability.value.has(ROLES.SELLER),
      status: roleAvailability.value.has(ROLES.SELLER) ? 'Available' : 'Register required',
      role: roleAvailability.value.has(ROLES.SELLER) ? ROLES.SELLER : null,
      route: roleAvailability.value.has(ROLES.SELLER) ? undefined : { name: 'auth.seller-register' },
      href: roleAvailability.value.has(ROLES.SELLER) ? bizWebPath('/seller') : undefined,
      cta: 'Open seller',
      fallbackCta: 'Register business',
    },
    {
      title: 'Business CRM',
      icon: 'solar:buildings-3-bold',
      available: roleAvailability.value.has(ROLES.CRM_MEMBER),
      status: roleAvailability.value.has(ROLES.CRM_MEMBER) ? 'Available' : 'Invite required',
      role: roleAvailability.value.has(ROLES.CRM_MEMBER) ? ROLES.CRM_MEMBER : null,
      href: roleAvailability.value.has(ROLES.CRM_MEMBER) ? bizWebPath('/seller/crm') : undefined,
      cta: 'Open CRM',
    },
    {
      title: 'Admin dashboard',
      icon: 'solar:shield-user-bold',
      available: roleAvailability.value.has(ROLES.ADMIN) || roleAvailability.value.has(ROLES.STAFF),
      status:
        roleAvailability.value.has(ROLES.ADMIN) || roleAvailability.value.has(ROLES.STAFF)
          ? 'Available'
          : 'Restricted',
      role: roleAvailability.value.has(ROLES.ADMIN)
        ? ROLES.ADMIN
        : roleAvailability.value.has(ROLES.STAFF)
          ? ROLES.STAFF
          : null,
      href:
        roleAvailability.value.has(ROLES.ADMIN) || roleAvailability.value.has(ROLES.STAFF)
          ? adminWebPath('/dashboard')
          : undefined,
      cta: 'Open admin',
    },
  ])

  async function switchRole(role: AccountRole) {
    auth.setActiveAccountRole(role)
    const target = roleDefaultRoutes[role]
    if (!target) return
    if (target.href) {
      window.location.href = target.href
      return
    }
    if (target.name) await router.push({ name: target.name })
  }

  return {
    activeAccountRole,
    roleSwitchOptions,
    workspaceCards,
    switchRole,
  }
}
