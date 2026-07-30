/**
 * Trust / company infrastructure for marketing surfaces (footer, About, Safety, Coverage).
 * Update legal entity and social URLs when corporate details change.
 */

export const companyLegal = {
  brand: 'KkooApp',
  /** Registered operating company — update when formal entity name is confirmed. */
  legalEntity: 'KKOO Technologies Limited',
  jurisdiction: 'United Republic of Tanzania',
  supportEmail: 'info@kkooapp.co.tz',
  safetyEmail: 'safety@kkooapp.co.tz',
  pressEmail: 'press@kkooapp.co.tz',
  investorsEmail: 'investors@kkooapp.co.tz',
} as const

export const companySocialLinks = [
  {
    key: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/kkooapp',
    icon: 'mdi:instagram',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/kkooapp',
    icon: 'mdi:facebook',
  },
  {
    key: 'x',
    label: 'X',
    href: 'https://x.com/kkooapp',
    icon: 'mdi:twitter',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/kkoo',
    icon: 'mdi:linkedin',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@kkooapp',
    icon: 'ic:baseline-tiktok',
  },
] as const

/** Live and expanding service coverage — keep honest about what is live. */
export const coverageCities = [
  {
    countryKey: 'tanzania',
    cities: [
      { name: 'Dar es Salaam', status: 'live' as const, services: ['Shop', 'Food', 'Grocery', 'Send', 'Ride'] },
      { name: 'Arusha', status: 'live' as const, services: ['Shop', 'Food', 'Send'] },
      { name: 'Mwanza', status: 'expanding' as const, services: ['Shop', 'Send'] },
      { name: 'Dodoma', status: 'expanding' as const, services: ['Shop'] },
    ],
  },
  {
    countryKey: 'eastAfricaNext',
    cities: [
      { name: 'Nairobi', status: 'planned' as const, services: ['Shop', 'Food'] },
      { name: 'Kampala', status: 'planned' as const, services: ['Shop'] },
    ],
  },
] as const

export const COOKIE_CONSENT_KEY = 'kkoo_cookie_consent_v1'
