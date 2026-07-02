/**
 * KKOO Wallet API — in-app digital wallet for frictionless payments
 * Docs: https://kkooapp-backend-fiber/docs/INTEGRATION.md#8-kkoo-wallet
 */
import client from './client'
import type { KkooWallet, WalletTransaction } from '../types/wallet'

export type WalletBalanceResponse = {
  wallet: KkooWallet
  transaction_count?: number
  total_deposited?: number
  total_spent?: number
  total_withdrawn?: number
}

function normalizeWalletBalancePayload(data: unknown): WalletBalanceResponse {
  if (data && typeof data === 'object' && 'wallet' in data) {
    return data as WalletBalanceResponse
  }
  return { wallet: data as KkooWallet }
}

// User wallet endpoints
export async function getWalletBalance(): Promise<WalletBalanceResponse> {
  const data = await client.get('/wallet/').then((r) => r.data)
  return normalizeWalletBalancePayload(data)
}

export async function depositToWallet(amount: number): Promise<{
  deposit_url?: string
  payment_ref?: string
  message: string
}> {
  return client.post('/wallet/deposit/', { amount }).then((r) => r.data)
}

export async function withdrawFromWallet(amount: number): Promise<{
  withdrawal_id: number
  status: string
  message: string
}> {
  return client.post('/wallet/withdraw/', { amount }).then((r) => r.data)
}

export async function getWalletTransactions(params?: {
  page?: number
  page_size?: number
  type?: string
}): Promise<{ results: WalletTransaction[]; total: number; page: number }> {
  const data = await client.get('/wallet/transactions/', { params }).then((r) => r.data)
  const count = typeof data?.count === 'number' ? data.count : data?.total ?? 0
  return {
    results: data?.results ?? [],
    total: count,
    page: data?.page ?? params?.page ?? 1,
  }
}

// Admin endpoints
export async function adminListWallets(params?: {
  page?: number
  page_size?: number
}): Promise<{ results: KkooWallet[]; total: number }> {
  return client.get('/admin/wallets/', { params }).then((r) => r.data)
}

export async function adminCreditWallet(data: {
  user_id: number
  amount: number
  reason?: string
}): Promise<WalletTransaction> {
  return client.post('/admin/wallet/credit/', data).then((r) => r.data)
}

export async function adminFreezeWallet(data: {
  user_id: number
  reason?: string
}): Promise<{ message: string }> {
  return client.post('/admin/wallet/freeze/', data).then((r) => r.data)
}
