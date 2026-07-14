/**
 * Social share targets for product Share & Earn.
 * Many apps (IG Stories, WA Status, TikTok) have no public web share URL for links —
 * those actions copy the message and open the app so the user can paste.
 */

export type ShareAppId = 'whatsapp' | 'facebook' | 'instagram' | 'tiktok' | 'system'

export type ShareActionId =
  | 'message'
  | 'status'
  | 'post'
  | 'story'
  | 'messenger'
  | 'dm'
  | 'open'

export type ShareAction = {
  id: ShareActionId
  labelKey: string
  /** When true, copy share text before opening the app. */
  copyFirst: boolean
  /** Build open URL; empty = copy-only / system share. */
  href?: (link: string, message: string) => string
}

export type ShareApp = {
  id: ShareAppId
  label: string
  icon: string
  tone: string
  actions: ShareAction[]
}

export const SHARE_APPS: ShareApp[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'mdi:whatsapp',
    tone: 'wa',
    actions: [
      {
        id: 'message',
        labelKey: 'buyerXp.shareEarn.actionMessage',
        copyFirst: false,
        href: (_link, message) => `https://wa.me/?text=${encodeURIComponent(message)}`,
      },
      {
        id: 'status',
        labelKey: 'buyerXp.shareEarn.actionStatus',
        copyFirst: true,
        href: () => 'https://wa.me/',
      },
    ],
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: 'mdi:facebook',
    tone: 'fb',
    actions: [
      {
        id: 'post',
        labelKey: 'buyerXp.shareEarn.actionPost',
        copyFirst: false,
        href: (link) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      },
      {
        id: 'story',
        labelKey: 'buyerXp.shareEarn.actionStory',
        copyFirst: true,
        href: () => 'https://www.facebook.com/',
      },
      {
        id: 'messenger',
        labelKey: 'buyerXp.shareEarn.actionMessenger',
        copyFirst: false,
        href: (link) =>
          `https://www.facebook.com/dialog/send?link=${encodeURIComponent(link)}&redirect_uri=${encodeURIComponent(link)}`,
      },
      {
        id: 'status',
        labelKey: 'buyerXp.shareEarn.actionStatus',
        copyFirst: true,
        href: () => 'https://www.facebook.com/',
      },
    ],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: 'mdi:instagram',
    tone: 'ig',
    actions: [
      {
        id: 'story',
        labelKey: 'buyerXp.shareEarn.actionStory',
        copyFirst: true,
        href: () => 'https://www.instagram.com/',
      },
      {
        id: 'dm',
        labelKey: 'buyerXp.shareEarn.actionDm',
        copyFirst: true,
        href: () => 'https://www.instagram.com/direct/inbox/',
      },
      {
        id: 'post',
        labelKey: 'buyerXp.shareEarn.actionPost',
        copyFirst: true,
        href: () => 'https://www.instagram.com/',
      },
    ],
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: 'ic:baseline-tiktok',
    tone: 'tt',
    actions: [
      {
        id: 'open',
        labelKey: 'buyerXp.shareEarn.actionTiktok',
        copyFirst: true,
        href: () => 'https://www.tiktok.com/upload',
      },
    ],
  },
  {
    id: 'system',
    label: 'More',
    icon: 'solar:share-bold',
    tone: 'sys',
    actions: [
      {
        id: 'open',
        labelKey: 'buyerXp.shareEarn.actionSystem',
        copyFirst: false,
      },
    ],
  },
]

export function hintKeyForAction(appId: ShareAppId, actionId: ShareActionId): string {
  if (appId === 'whatsapp' && actionId === 'status') return 'buyerXp.shareEarn.hintWhatsappStatus'
  if (appId === 'facebook' && (actionId === 'story' || actionId === 'status')) return 'buyerXp.shareEarn.hintFacebookStory'
  if (appId === 'instagram') return 'buyerXp.shareEarn.hintInstagram'
  if (appId === 'tiktok') return 'buyerXp.shareEarn.hintTiktok'
  return 'buyerXp.shareEarn.hintCopied'
}
