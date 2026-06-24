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
  '/cookie-policy',
  '/refund-policy',
  '/acceptable-use',
  '/pages',
] as const

export function isPublicMarketingRouteName(name: unknown): boolean {
  return typeof name === 'string' && name.startsWith(PUBLIC_MARKETING_ROUTE_PREFIX)
}

export function isPublicAppPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/') return true
  return PUBLIC_APP_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )
}
