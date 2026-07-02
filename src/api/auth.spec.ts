import { describe, it, expect, vi, beforeEach } from 'vitest'

const { post } = vi.hoisted(() => ({
  post: vi.fn().mockResolvedValue({ data: { user: {}, tokens: { access: 'a', refresh: 'r' } } }),
}))

vi.mock('./client', () => ({
  default: {
    post,
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}))

import { authApi } from './auth'

describe('authApi registration payloads', () => {
  beforeEach(() => {
    post.mockClear()
  })

  it('registerBuyer sends is_buyer true', async () => {
    await authApi.registerBuyer({
      phone_number: '+255798765432',
      first_name: 'John',
      last_name: 'Buyer',
    })

    expect(post).toHaveBeenCalledWith('/users/register/', {
      phone_number: '+255798765432',
      first_name: 'John',
      last_name: 'Buyer',
      is_buyer: true,
    })
  })
})
