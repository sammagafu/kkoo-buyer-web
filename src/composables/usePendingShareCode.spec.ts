import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  peekPendingShareCode,
  setPendingShareCode,
  takePendingShareCode,
} from './usePendingShareCode'

describe('usePendingShareCode', () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v)
      },
      removeItem: (k: string) => {
        store.delete(k)
      },
    })
  })

  it('stores and peeks a share code', () => {
    setPendingShareCode('abc123def456')
    expect(peekPendingShareCode()).toBe('abc123def456')
  })

  it('take clears the stored code', () => {
    setPendingShareCode('aabbccddeeff0011')
    expect(takePendingShareCode()).toBe('aabbccddeeff0011')
    expect(takePendingShareCode()).toBeUndefined()
  })

  it('ignores blank codes', () => {
    setPendingShareCode('   ')
    expect(peekPendingShareCode()).toBeUndefined()
  })
})
