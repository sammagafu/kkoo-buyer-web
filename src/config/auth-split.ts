import { bizSellerRegisterUrl } from '@/config/landing-links'
import { buyerWebPath } from '@/config/cross-app-links'

export type AuthPortal = 'buyer' | 'seller' | 'admin'

export type AuthSplitFooterLink = {
  label: string
  href?: string
  to?: { name: string; query?: Record<string, string> }
  variant?: 'ghost' | 'text'
  external?: boolean
}

export type AuthSplitContent = {
  eyebrow: string
  tagline: string
  title: string
  lead: string
  points: string[]
  footerLinks?: AuthSplitFooterLink[]
}

export const authSplitByPortal: Record<AuthPortal, AuthSplitContent> = {
  buyer: {
    eyebrow: 'KKOO Buyer',
    tagline: 'Shop · Sell · Move',
    title: 'Shop, order, and track in one place.',
    lead: 'Food, groceries, local shops, and parcels — same account, escrow checkout, and live tracking.',
    points: ['Escrow-protected checkout', 'Live delivery updates', 'Rewards on every order'],
    footerLinks: [
      { label: 'Browse marketplace', href: buyerWebPath('/marketplace'), variant: 'ghost' },
    ],
  },
  seller: {
    eyebrow: 'KKOO Seller',
    tagline: 'Your business, one dashboard',
    title: 'Run your shop and get paid when buyers confirm.',
    lead: 'List products, take orders, sync POS, and manage your business from one dashboard.',
    points: ['Online + in-store sales', 'Inventory & CRM tools', 'Clear payouts after delivery'],
    footerLinks: [
      { label: 'Shop on KKOO', href: buyerWebPath('/marketplace'), variant: 'ghost', external: true },
      { label: 'Buyer sign in', href: buyerWebPath('/auth/sign-in'), variant: 'text', external: true },
    ],
  },
  admin: {
    eyebrow: 'KKOO Admin',
    tagline: 'Platform operations',
    title: 'Operate the platform with confidence.',
    lead: 'Users, orders, catalog, logistics, and analytics — secure tools for KKOO teams.',
    points: ['Role-based access', 'Audit-friendly controls', 'Built for East Africa scale'],
    footerLinks: [
      { label: 'Buyer app', href: buyerWebPath('/'), variant: 'ghost', external: true },
      { label: 'Seller portal', href: bizSellerRegisterUrl, variant: 'text', external: true },
    ],
  },
}
