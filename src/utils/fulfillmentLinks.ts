/** Build buyer ride route with optional prefill for food/grocery delivery. */
export function buildRideLink(params: {
  pickup?: string
  dropoff?: string
  notes?: string
  vehicleType?: string
}) {
  const query: Record<string, string> = {}
  const pickup = params.pickup?.trim()
  const dropoff = params.dropoff?.trim()
  const notes = params.notes?.trim()
  const vehicle = params.vehicleType?.trim() || 'bike'
  if (pickup) query.pickup = pickup
  if (dropoff) query.dropoff = dropoff
  if (notes) query.notes = notes
  if (vehicle) query.vehicle_type = vehicle
  return { name: 'buyer.ride' as const, query }
}

export function buildCheckoutLink(fulfillment?: string) {
  if (!fulfillment) return { name: 'buyer.checkout' as const }
  return { name: 'buyer.checkout' as const, query: { fulfillment } }
}
