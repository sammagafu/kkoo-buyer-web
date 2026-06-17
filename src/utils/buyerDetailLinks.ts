import type { RouteLocationRaw } from 'vue-router'

export type VenueVertical = 'eats' | 'grocery' | 'pharmacy' | 'hotel'

export function productDetailLink(id: number | string): RouteLocationRaw {
  return { name: 'buyer.product', params: { id: String(id) } }
}

export function productDetailBySlug(slug: string): RouteLocationRaw {
  return { name: 'buyer.product.slug', params: { slug } }
}

export function categoryDetailLink(slug: string): RouteLocationRaw {
  return { name: 'buyer.category', params: { slug } }
}

export function venueDetailLink(
  vertical: VenueVertical,
  sellerId: number | string,
  query?: Record<string, string>,
): RouteLocationRaw {
  const id = String(sellerId)
  const names: Record<VenueVertical, string> = {
    eats: 'buyer.eats.store',
    grocery: 'buyer.grocery.store',
    pharmacy: 'buyer.pharmacy.store',
    hotel: 'buyer.booking.hotel',
  }
  return { name: names[vertical], params: { sellerId: id }, query }
}

export function flashSaleDetailLink(slug: string): RouteLocationRaw {
  return { name: 'buyer.flash-sale', params: { slug } }
}

export function rideDetailLink(id: number | string): RouteLocationRaw {
  return { name: 'buyer.ride.detail', params: { id: String(id) } }
}
