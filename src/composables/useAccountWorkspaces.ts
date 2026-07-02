import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ROLES } from '@/acl'
import { BUYER_ACCOUNT_ROLE, useAuthStore, type AccountRole } from '@/stores/auth'
import { adminWebPath, bizWebPath } from '@/config/cross-app-links'
import { bizSellerAccountUrl, bizSellerRegisterUrl } from '@/config/landing-links'

type WorkspaceCard = {
  title: string
  icon: string
  available: boolean
  status: string
  role: AccountRole | null
  route?: RouteLocationRaw
  href?: string
  cta: string
  fallbackCta?: string
}

const roleIcons: Record<AccountRole, string> = {
  [BUYER_ACCOUNT_ROLE]: 'solar:cart-large-2-bold',
  [ROLES.SELLER]: 'solar:shop-2-bold',
  [ROLES.ADMIN]: 'solar:shield-user-bold',
  [ROLES.STAFF]: 'solar:users-group-rounded-bold',
  [ROLES.CRM_MEMBER]: 'solar:buildings-3-bold',
}

const roleLabelKeys: Record<AccountRole, string> = {
  [BUYER_ACCOUNT_ROLE]: 'buyerXp.hub.workspaces.roles.buyer',
  [ROLES.SELLER]: 'buyerXp.hub.workspaces.roles.seller',
  [ROLES.ADMIN]: 'buyerXp.hub.workspaces.roles.admin',
  [ROLES.STAFF]: 'buyerXp.hub.workspaces.roles.staff',
  [ROLES.CRM_MEMBER]: 'buyerXp.hub.workspaces.roles.crm',
}

const roleDefaultRoutes: Record<AccountRole, { name?: string; href?: string }> = {
  [BUYER_ACCOUNT_ROLE]: { name: 'buyer.marketplace' },
  [ROLES.SELLER]: { href: bizSellerAccountUrl },
  [ROLES.ADMIN]: { href: adminWebPath('/dashboard') },
  [ROLES.STAFF]: { href: adminWebPath('/dashboard') },
  [ROLES.CRM_MEMBER]: { href: bizWebPath('/seller/crm') },
}

export function useAccountWorkspaces() {
  const { t, locale } = useI18n()
  const auth = useAuthStore()
  const router = useRouter()
  const { activeAccountRole, availableAccountRoles } = storeToRefs(auth)

  const roleSwitchOptions = computed(() => {
    void locale.value
    return availableAccountRoles.value.map((role) => ({
      role,
      label: t(roleLabelKeys[role]),
      icon: roleIcons[role],
    }))
  })

  const roleAvailability = computed(() => new Set(availableAccountRoles.value))

  const workspaceCards = computed((): WorkspaceCard[] => {
    void locale.value
    const hasSeller = roleAvailability.value.has(ROLES.SELLER)
    const hasCrm = roleAvailability.value.has(ROLES.CRM_MEMBER)
    const hasAdmin = roleAvailability.value.has(ROLES.ADMIN)
    const hasStaff = roleAvailability.value.has(ROLES.STAFF)

    return [
      {
        title: t('buyerXp.hub.workspaces.buyerAccount'),
        icon: 'solar:user-circle-bold',
        available: true,
        status:
          activeAccountRole.value === BUYER_ACCOUNT_ROLE
            ? t('buyerXp.hub.workspaces.current')
            : t('buyerXp.hub.workspaces.available'),
        role: BUYER_ACCOUNT_ROLE,
        cta: t('buyerXp.hub.workspaces.openBuyer'),
      },
      {
        title: t('buyerXp.hub.workspaces.sellerAccount'),
        icon: 'solar:shop-2-bold',
        available: hasSeller,
        status: hasSeller
          ? t('buyerXp.hub.workspaces.available')
          : t('buyerXp.hub.workspaces.registerRequired'),
        role: hasSeller ? ROLES.SELLER : null,
        href: hasSeller ? bizSellerAccountUrl : bizSellerRegisterUrl,
        cta: hasSeller
          ? t('buyerXp.hub.workspaces.openSellerAccount')
          : t('buyerXp.hub.workspaces.sellOnKkoo'),
        fallbackCta: t('buyerXp.hub.workspaces.sellOnKkoo'),
      },
      {
        title: t('buyerXp.hub.workspaces.businessCrm'),
        icon: 'solar:buildings-3-bold',
        available: hasCrm,
        status: hasCrm
          ? t('buyerXp.hub.workspaces.available')
          : t('buyerXp.hub.workspaces.inviteRequired'),
        role: hasCrm ? ROLES.CRM_MEMBER : null,
        href: hasCrm ? bizWebPath('/seller/crm') : undefined,
        cta: t('buyerXp.hub.workspaces.openCrm'),
      },
      {
        title: t('buyerXp.hub.workspaces.adminDashboard'),
        icon: 'solar:shield-user-bold',
        available: hasAdmin || hasStaff,
        status:
          hasAdmin || hasStaff
            ? t('buyerXp.hub.workspaces.available')
            : t('buyerXp.hub.workspaces.restricted'),
        role: hasAdmin ? ROLES.ADMIN : hasStaff ? ROLES.STAFF : null,
        href: hasAdmin || hasStaff ? adminWebPath('/dashboard') : undefined,
        cta: t('buyerXp.hub.workspaces.openAdmin'),
      },
    ]
  })

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
