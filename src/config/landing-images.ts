export type LandingResponsiveImage = {
  src: string
  srcset: string
  sizes: string
  width: number
  height: number
}

const SERVICE_KEYS = [
  'shop',
  'food',
  'groceries',
  'ride',
  'restaurants',
  'hotels',
  'pharmacy',
  'send',
  'discovery',
  'hustle',
] as const

export type LandingServiceImageKey = (typeof SERVICE_KEYS)[number]

/** Hero is LCP on mobile (stacked above the copy). */
export const landingHeroImage: LandingResponsiveImage = {
  src: '/images/landing/hero-960.webp',
  srcset: [
    '/images/landing/hero-640.webp 640w',
    '/images/landing/hero-960.webp 960w',
    '/images/landing/hero-1280.webp 1280w',
  ].join(', '),
  sizes: '(max-width: 899px) 100vw, 42vw',
  width: 960,
  height: 540,
}

export function serviceCardImage(name: LandingServiceImageKey): LandingResponsiveImage {
  return {
    src: `/images/landing/services/${name}-820.webp`,
    srcset: [
      `/images/landing/services/${name}-410.webp 410w`,
      `/images/landing/services/${name}-820.webp 820w`,
    ].join(', '),
    sizes: '(max-width: 640px) 92vw, (max-width: 1100px) 44vw, 410px',
    width: 820,
    height: 513,
  }
}

export const landingPhoneImage: LandingResponsiveImage = {
  src: '/images/landing/download-phone-800.webp',
  srcset: [
    '/images/landing/download-phone-400.webp 400w',
    '/images/landing/download-phone-800.webp 800w',
  ].join(', '),
  sizes: '(max-width: 699px) 220px, 280px',
  width: 400,
  height: 800,
}

/** Compact src for templates that only take a URL (still a sized WebP, not the 1720px JPEG). */
export function landingSrc(
  key: 'hero' | 'phone' | 'cat' | LandingServiceImageKey,
): string {
  if (key === 'hero') return landingHeroImage.src
  if (key === 'phone') return landingPhoneImage.src
  if (key === 'cat') return serviceCardImage('discovery').src
  return serviceCardImage(key).src
}
