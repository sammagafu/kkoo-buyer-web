/** Marketing / legal pages — no sign-in required; auth guard must not redirect away. */
export const PUBLIC_MARKETING_ROUTE_PREFIX = 'pages.'

export const PUBLIC_APP_PATH_PREFIXES = [
  '/app',
  '/personal',
  '/business',
  '/merchant',
  '/seller',
  '/join',
  '/restaurants',
  '/hotels',
  '/vouchers',
  '/share-earn',
  '/courier',
  '/community',
  '/discover',
  '/careers',
  '/partners',
  '/terms-of-use',
  '/privacy-policy',
  '/data-deletion',
  '/cookie-policy',
  '/refund-policy',
  '/acceptable-use',
  '/pages',
  '/whatsapp',
] as const

/** Buyer shopping routes that guests can open without sign-in (router + axios must not force login). */
export const PUBLIC_BUYER_BROWSE_PATH_PREFIXES = [
  '/home',
  '/dashboard',
  '/market',
  '/marketplace',
  '/search',
  '/eats',
  '/grocery',
  '/pharmacy',
  '/services',
  '/nearby',
  '/send',
  '/parcel',
  '/ride',
  '/booking',
  '/checkout',
  '/product',
  '/category',
  '/flash-sales',
  '/premium',
  '/wholesale',
  '/compare',
  '/web',
] as const

export function isPublicMarketingRouteName(name: unknown): boolean {
  return typeof name === 'string' && name.startsWith(PUBLIC_MARKETING_ROUTE_PREFIX)
}

export function isPublicBuyerBrowsePath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  return PUBLIC_BUYER_BROWSE_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )
}

export function isPublicAppPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/') return true
  if (isPublicBuyerBrowsePath(path)) return true
  return PUBLIC_APP_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )
}
