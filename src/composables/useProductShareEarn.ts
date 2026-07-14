import { ref, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sharesApi } from '@/api/shares'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'

export type ProductSharePreview = {
  productId?: number
  productSlug?: string
  title?: string
  priceLabel?: string
  imageUrl?: string | null
}

export type ProductShareResult = {
  code?: string
  land_url?: string
  share_url?: string
  share_text?: string
  whatsapp_share_url?: string
  facebook_share_url?: string
}

const open = ref(false)
const loading = ref(false)
const error = ref('')
const preview = shallowRef<ProductSharePreview | null>(null)
const result = shallowRef<ProductShareResult | null>(null)

export function useProductShareEarn() {
  const auth = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  async function requestShare(p: ProductSharePreview) {
    if (!p.productId && !p.productSlug) return
    if (!auth.isAuthenticated) {
      await router.push({ name: 'auth.sign-in', query: { redirectedFrom: route.fullPath } })
      return
    }
    preview.value = p
    result.value = null
    error.value = ''
    open.value = true
    loading.value = true
    try {
      const { data } = await sharesApi.create({
        product_id: p.productId,
        product_slug: p.productSlug,
      })
      result.value = (data ?? null) as ProductShareResult
    } catch (e) {
      error.value = formatApiError(e, 'Could not create share link')
    } finally {
      loading.value = false
    }
  }

  function closeShareSheet() {
    open.value = false
  }

  function shareLink() {
    return String(result.value?.land_url || result.value?.share_url || '').trim()
  }

  function shareMessage() {
    const link = shareLink()
    const rawText = String(result.value?.share_text ?? '').trim()
    const productUrl = String(result.value?.share_url ?? '').trim()
    if (rawText && link) {
      if (productUrl && productUrl !== link) return rawText.replace(productUrl, link)
      return rawText
    }
    const p = preview.value
    if (p?.title && link) {
      return `${p.title}${p.priceLabel ? ` – ${p.priceLabel}` : ''} – ${link}`
    }
    return link
  }

  function whatsappUrl() {
    const msg = shareMessage()
    if (!msg) return ''
    return result.value?.whatsapp_share_url?.trim()
      || `https://wa.me/?text=${encodeURIComponent(msg)}`
  }

  function facebookUrl() {
    const link = shareLink()
    if (!link) return ''
    return result.value?.facebook_share_url?.trim()
      || `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
  }

  async function shareViaSystem() {
    const link = shareLink()
    const text = shareMessage()
    if (!link && !text) return false
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: preview.value?.title || 'KKOO',
          text: text || undefined,
          url: link || undefined,
        })
        return true
      } catch {
        return false
      }
    }
    return false
  }

  return {
    open,
    loading,
    error,
    preview,
    result,
    requestShare,
    closeShareSheet,
    shareLink,
    shareMessage,
    whatsappUrl,
    facebookUrl,
    shareViaSystem,
  }
}
