import { describe, expect, it, vi } from 'vitest'

vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import client from './client'
import { getWalletBalance } from './wallet'

describe('getWalletBalance', () => {
  it('unwraps nested wallet payload from GET /wallet/', async () => {
    vi.mocked(client.get).mockResolvedValue({
      data: {
        wallet: {
          id: 1,
          user_id: 9,
          balance: 12500,
          currency: 'TZS',
          is_active: true,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
        transaction_count: 2,
        total_deposited: 20000,
        total_spent: 7500,
        total_withdrawn: 0,
      },
    })

    const result = await getWalletBalance()
    expect(result.wallet.balance).toBe(12500)
    expect(result.total_deposited).toBe(20000)
    expect(result.total_spent).toBe(7500)
  })
})
