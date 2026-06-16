import type { MenuItemType } from '@/types/menu'
import { buyerRoutes } from '@/config/landing-links'
import { adminWebPath, bizWebPath } from '@/config/cross-app-links'
import { ROLES } from '@/acl'
import type { User } from '@/types/auth'

/** Sidebar for buyer web — account + shop links; seller/admin open on other apps. */
export function getBuyerMenuItems(
  role: string | null,
  _sellerVerified = true,
  user?: User | null,
): MenuItemType[] {
  const items: MenuItemType[] = [
    { key: 'buyer-menu', label: 'KKOO', isTitle: true },
    {
      key: 'account-home',
      icon: 'solar:user-circle-broken',
      label: 'My account',
      route: { name: 'account.home' },
    },
    {
      key: 'account-profile',
      icon: 'solar:user-id-broken',
      label: 'Profile',
      route: { name: 'account.profile' },
    },
    {
      key: 'account-notifications',
      icon: 'solar:bell-broken',
      label: 'Notifications',
      route: { name: 'account.notifications' },
    },
    { key: 'shop-menu', label: 'Shop', isTitle: true },
    {
      key: 'marketplace',
      icon: 'solar:cart-large-2-broken',
      label: 'Marketplace',
      route: buyerRoutes.marketplace,
    },
    {
      key: 'eats',
      icon: 'solar:cup-hot-broken',
      label: 'Eats',
      route: buyerRoutes.eats,
    },
    {
      key: 'grocery',
      icon: 'solar:bag-2-broken',
      label: 'Groceries',
      route: buyerRoutes.grocery,
    },
    {
      key: 'discover',
      icon: 'solar:calendar-broken',
      label: 'Discover',
      route: buyerRoutes.discover,
    },
  ]

  const isSeller = role === ROLES.SELLER || user?.is_seller === true
  const isStaff = user?.is_staff === true || user?.isStaff === true
  const isAdmin = user?.is_superuser === true || user?.isSuperuser === true

  if (isSeller) {
    items.push(
      { key: 'workspaces', label: 'Workspaces', isTitle: true },
      {
        key: 'biz-seller',
        icon: 'solar:shop-2-broken',
        label: 'Seller dashboard',
        url: bizWebPath('/seller'),
        target: '_blank',
      },
    )
  }

  if (role === ROLES.CRM_MEMBER) {
    items.push({
      key: 'biz-crm',
      icon: 'solar:buildings-3-broken',
      label: 'Business CRM',
      url: bizWebPath('/seller/crm'),
      target: '_blank',
    })
  }

  if (isAdmin || isStaff) {
    items.push({
      key: 'admin-panel',
      icon: 'solar:shield-user-broken',
      label: 'Admin panel',
      url: adminWebPath('/dashboard'),
      target: '_blank',
    })
  }

  return items
}
