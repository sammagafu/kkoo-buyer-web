/**
 * KKOO icon system — Solar (Iconify) everywhere for visual consistency.
 * Use `kkooIcon()` for bootstrap-style slugs or full `solar:*` ids.
 */

export const KKOO_ICON_PREFIX = 'solar' as const

/** Bootstrap Icons slug → Solar bold (default UI weight). */
const BOOTSTRAP_TO_SOLAR: Record<string, string> = {
  'shield-lock-fill': 'solar:shield-keyhole-bold',
  'shield-lock': 'solar:shield-keyhole-bold',
  'shield-check': 'solar:shield-check-bold',
  'shield-fill-check': 'solar:shield-check-bold',
  'geo-alt-fill': 'solar:map-point-bold',
  'geo-alt': 'solar:map-point-bold',
  'geo-fill': 'solar:map-point-bold',
  'patch-check-fill': 'solar:verified-check-bold',
  'patch-check': 'solar:verified-check-bold',
  'cash-coin': 'solar:dollar-bold',
  coin: 'solar:dollar-bold',
  download: 'solar:download-bold',
  speedometer2: 'solar:speedometer-bold',
  'bag-heart': 'solar:bag-heart-bold',
  'chevron-double-down': 'solar:double-alt-arrow-down-bold',
  'shop-window': 'solar:shop-2-bold',
  shop: 'solar:shop-2-bold',
  check2: 'solar:check-circle-bold',
  'check-circle': 'solar:check-circle-bold',
  'arrow-repeat': 'solar:refresh-bold',
  stars: 'solar:stars-bold',
  'lightning-charge-fill': 'solar:bolt-bold',
  'lightning-fill': 'solar:bolt-bold',
  lightning: 'solar:bolt-bold',
  'clock-history': 'solar:history-bold',
  'rocket-takeoff-fill': 'solar:rocket-bold',
  'rocket-takeoff': 'solar:rocket-bold',
  'link-45deg': 'solar:link-bold',
  'arrow-right': 'solar:arrow-right-linear',
  globe2: 'solar:global-bold',
  'window-stack': 'solar:widget-5-bold',
  scooter: 'solar:scooter-bold',
  'person-heart': 'solar:user-heart-bold',
  people: 'solar:users-group-rounded-bold',
  'people-fill': 'solar:users-group-rounded-bold',
  'bag-check': 'solar:bag-check-bold',
  'cart-check-fill': 'solar:cart-check-bold',
  trophy: 'solar:cup-bold',
  'trophy-fill': 'solar:cup-bold',
  phone: 'solar:smartphone-bold',
  'cash-stack': 'solar:wallet-money-bold',
  'graph-up': 'solar:graph-up-bold',
  'graph-up-arrow': 'solar:graph-up-bold',
  'person-vcard': 'solar:user-id-bold',
  'box-seam': 'solar:box-bold',
  'box-seam-fill': 'solar:box-bold',
  megaphone: 'solar:megaphone-bold',
  truck: 'solar:delivery-bold',
  'bar-chart-fill': 'solar:chart-bold',
  bank2: 'solar:bank-bold',
  receipt: 'solar:bill-list-bold',
  gift: 'solar:gift-bold',
  share: 'solar:share-bold',
  'share-fill': 'solar:share-bold',
  tag: 'solar:tag-bold',
  compass: 'solar:compass-bold',
  'star-fill': 'solar:star-bold',
  'award-fill': 'solar:medal-star-bold',
  gem: 'solar:crown-bold',
  wallet2: 'solar:wallet-bold',
  'arrow-left-right': 'solar:transfer-horizontal-bold',
  'grid-fill': 'solar:widget-bold',
  broadcast: 'solar:record-bold',
  'credit-card-fill': 'solar:card-bold',
  laptop: 'solar:laptop-bold',
  'google-play': 'solar:google-play-bold',
  apple: 'solar:apple-bold',
  windows: 'solar:windows-bold',
}

const ARROW_LINEAR = new Set(['arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'alt-arrow-right', 'alt-arrow-left'])

/**
 * Resolve an icon id to Solar. Pass full Iconify ids (`solar:…`) unchanged.
 */
export function kkooIcon(name: string, variant: 'bold' | 'linear' = 'bold'): string {
  const trimmed = name.trim()
  if (!trimmed) return 'solar:question-circle-bold'
  if (trimmed.includes(':')) return trimmed

  const mapped = BOOTSTRAP_TO_SOLAR[trimmed]
  if (mapped) return mapped

  if (trimmed === 'magnifer') return 'solar:magnifer-linear'

  const weight = ARROW_LINEAR.has(trimmed) ? 'linear' : variant
  return `solar:${trimmed}-${weight}`
}

/** Parse legacy `bi bi-bag-heart` class strings from marketing data. */
export function kkooIconFromLegacy(className: string): string {
  const slug = className
    .split(/\s+/)
    .find((token) => token.startsWith('bi-') && token !== 'bi')
    ?.replace(/^bi-/, '')
  return slug ? kkooIcon(slug) : 'solar:question-circle-bold'
}

/** Default check / fallback icon for feature lists. */
export const KKOO_ICON_CHECK = 'solar:check-circle-bold'

/** Common navigation arrows (match marketing CTAs). */
export const KKOO_ICON_ARROW = 'solar:arrow-right-up-linear'
export const KKOO_ICON_ARROW_INLINE = 'solar:arrow-right-linear'
