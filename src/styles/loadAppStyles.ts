import { isStoreSubdomainHost } from '@/utils/storePublicUrl'

let pending: Promise<void> | null = null

export function needsFullAppStyles(path: string): boolean {
  if (typeof window !== 'undefined' && isStoreSubdomainHost()) {
    return true
  }
  const clean = (path.split('?')[0] || '/').replace(/\/+$/, '') || '/'
  return clean !== '/'
}

/** Heavy admin/buyer chrome CSS — skip on the public homepage. */
export function loadAppStyles(): Promise<void> {
  if (!pending) {
    pending = Promise.all([
      import('@/assets/scss/app.scss'),
      import('@/assets/scss/icons.scss'),
      import('bootstrap-vue-next/dist/bootstrap-vue-next.css'),
    ]).then(() => undefined)
  }
  return pending
}
