import type { MenuItemType } from '@/types/menu'
import type { RouteType } from '@/types/index'
import { buyerRoutes, bizSellerRegisterUrl } from '@/config/landing-links'
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
      icon: 'solar:user-circle-bold',
      label: 'My account',
      route: { name: 'buyer.profile' },
    },
    {
      key: 'account-settings',
      icon: 'solar:settings-bold',
      label: 'Settings',
      route: { name: 'buyer.settings' },
    },
    {
      key: 'account-profile',
      icon: 'solar:user-id-bold',
      label: 'Profile',
      route: { name: 'account.profile' },
    },
    {
      key: 'account-notifications',
      icon: 'solar:bell-bold',
      label: 'Notifications',
      route: { name: 'account.notifications' },
    },
    { key: 'shop-menu', label: 'Shop', isTitle: true },
    {
      key: 'marketplace',
      icon: 'solar:cart-large-2-bold',
      label: 'Marketplace',
      route: buyerRoutes.marketplace as RouteType,
    },
    {
      key: 'eats',
      icon: 'solar:cup-hot-bold',
      label: 'Eats',
      route: buyerRoutes.eats as RouteType,
    },
    {
      key: 'grocery',
      icon: 'solar:bag-2-bold',
      label: 'Groceries',
      route: buyerRoutes.grocery as RouteType,
    },
    {
      key: 'discover',
      icon: 'solar:calendar-bold',
      label: 'Discover',
      route: buyerRoutes.discover as RouteType,
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
        icon: 'solar:shop-2-bold',
        label: 'Seller dashboard',
        url: bizWebPath('/seller'),
        target: '_blank',
      },
    )
  } else {
    items.push({
      key: 'sell-on-kkoo',
      icon: 'solar:shop-2-bold',
      label: 'Sell on KKOO',
      url: bizSellerRegisterUrl,
      target: '_blank',
    })
  }

  if (role === ROLES.CRM_MEMBER) {
    items.push({
      key: 'biz-crm',
      icon: 'solar:buildings-3-bold',
      label: 'Business CRM',
      url: bizWebPath('/seller/crm'),
      target: '_blank',
    })
  }

  if (isAdmin || isStaff) {
    items.push({
      key: 'admin-panel',
      icon: 'solar:shield-user-bold',
      label: 'Admin panel',
      url: adminWebPath('/dashboard'),
      target: '_blank',
    })
  }

  return items
}
