/**
 * Cart (auth). API.md: get, add, update item, remove item, clear.
 */
import client from './client'

type CartApiResponse = {
  items: Array<{
    id: number
    sku_id?: number
    quantity: number
    total_price?: number
    sku?: {
      id?: number
      price_override?: number | null
      product?: {
        title?: string
        base_price?: number
        discount_price?: number | null
        media?: Array<{ file?: string }>
      }
    }
    unavailable?: boolean
  }>
  final_total?: number
  original_total?: number
}

export const cartApi = {
  get() {
    return client.get<CartApiResponse>('/cart/')
  },
  add(
    skuOrPayload: number | { sku_id?: number; product_id?: number; quantity?: number },
    quantity = 1,
  ) {
    if (typeof skuOrPayload === 'number') {
      return client.post('/cart/add/', { sku_id: skuOrPayload, quantity })
    }
    return client.post('/cart/add/', { quantity: 1, ...skuOrPayload })
  },
  updateItem(itemId: number | string, quantity: number) {
    return client.patch(`/cart/items/${itemId}/update/`, { quantity })
  },
  removeItem(itemId: number | string) {
    return client.delete(`/cart/items/${itemId}/remove/`).catch(() => client.delete(`/cart/items/${itemId}/`))
  },
  removeItemByBody(body: { cart_item_id?: number; item_id?: number }) {
    return client.post('/cart/remove-item/', body)
  },
  clear() {
    return client.post('/cart/clear/')
  },
}
