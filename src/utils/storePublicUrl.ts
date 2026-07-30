/**
 * Public store microsite URLs: https://{slug}.kkooapp.co.tz
 * Local / preview keep path form: {origin}/store/{slug}
 */

const PRODUCTION_APEX = 'kkooapp.co.tz'

const RESERVED_STORE_SUBDOMAINS = new Set([
  'www',
  'api',
  'admin',
  'biz',
  'app',
  'mail',
  'cdn',
  'static',
  'assets',
  'media',
  'store',
  'menu',
  'account',
  'auth',
  'oauth',
  'eats',
  'ride',
  'rides',
  'market',
  'marketplace',
  'stay',
  'necha',
  'staging',
  'staging-api',
  'dev',
  'test',
  'docs',
  'status',
  'support',
  'help',
  'ftp',
  'ns1',
  'ns2',
])

function isLocalHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')
  )
}

/** Apex host for buyer web (no protocol). */
export function buyerApexHost(): string {
  const fromEnv = String(import.meta.env.VITE_MAIN_DOMAIN ?? import.meta.env.VITE_BUYER_WEB_ORIGIN ?? '')
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
  if (fromEnv) return fromEnv
  return PRODUCTION_APEX
}

export function isReservedStoreSubdomain(slug: string): boolean {
  return RESERVED_STORE_SUBDOMAINS.has(slug.trim().toLowerCase())
}

/** Whether this handle should use https://{slug}.apex (vs /store/{slug}). */
export function canUseStoreSubdomain(slug: string): boolean {
  const s = slug.trim().toLowerCase()
  if (!s || /^\d+$/.test(s) || s.startsWith('store-') || isReservedStoreSubdomain(s)) {
    return false
  }
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)
}

export function storeSlugFromHostname(
  hostname = typeof window !== 'undefined' ? window.location.hostname : '',
): string | null {
  const host = hostname.trim().toLowerCase()
  if (!host || isLocalHost(host)) return null

  const apex = buyerApexHost().toLowerCase()
  if (host === apex || host === `www.${apex}`) return null

  const suffix = `.${apex}`
  if (!host.endsWith(suffix)) return null

  const sub = host.slice(0, -suffix.length)
  if (!sub || sub.includes('.') || isReservedStoreSubdomain(sub)) return null
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sub)) return null
  return sub
}

export function isStoreSubdomainHost(hostname?: string): boolean {
  return storeSlugFromHostname(hostname) != null
}

export function storePublicUrl(
  slugOrId: string,
  opts?: { buyerOrigin?: string },
): string {
  const slug = String(slugOrId || '').trim()
  if (!slug) return ''

  const encoded = encodeURIComponent(slug)

  const buyerOrigin = (opts?.buyerOrigin || String(import.meta.env.VITE_BUYER_WEB_ORIGIN || '').trim()).replace(
    /\/$/,
    '',
  )
  if (buyerOrigin) {
    try {
      const u = new URL(buyerOrigin)
      if (isLocalHost(u.hostname)) {
        return `${buyerOrigin}/store/${encoded}`
      }
      if (u.hostname === PRODUCTION_APEX || u.hostname === `www.${PRODUCTION_APEX}`) {
        if (canUseStoreSubdomain(slug)) {
          return `https://${slug}.${PRODUCTION_APEX}`
        }
        return `https://${PRODUCTION_APEX}/store/${encoded}`
      }
    } catch {
      /* fall through */
    }
  }

  if (typeof window !== 'undefined' && isLocalHost(window.location.hostname)) {
    const origin = buyerOrigin || 'http://localhost:5175'
    return `${origin.replace(/\/$/, '')}/store/${encoded}`
  }

  if (!canUseStoreSubdomain(slug)) {
    return `https://${PRODUCTION_APEX}/store/${encoded}`
  }

  return `https://${slug}.${PRODUCTION_APEX}`
}
