import client from './client'

export type EventTicketClass = {
  id: number
  uuid: string
  name: string
  description?: string
  benefits?: string[]
  price: number
  currency: string
  capacity: number
  sold_count: number
  remaining: number
  on_sale: boolean
}

export type PlatformEvent = {
  id: number
  uuid: string
  title: string
  slug: string
  summary?: string
  description?: string
  category: string
  venue_name?: string
  venue_address?: string
  city?: string
  cover_image?: string
  starts_at: string
  ends_at: string
  organizer_name?: string
  is_featured?: boolean
  ticket_classes?: EventTicketClass[]
}

export type TicketPurchase = {
  purchase_id: number
  purchase_uuid: string
  ticket_code: string
  total_amount: number
  currency: string
  quantity: number
  status: string
  payment_status: string
}

export type MyTicketRow = {
  id: number
  uuid: string
  ticket_code: string
  quantity: number
  total_amount: number
  currency: string
  status: string
  payment_status: string
  attendee_name?: string
  event?: {
    title: string
    slug: string
    starts_at: string
    venue_name?: string
    city?: string
  }
  ticket_class?: {
    name: string
    benefits?: string[]
  }
}

export const eventsApi = {
  list(params?: { category?: string; city?: string; featured?: boolean }) {
    return client.get<{ results: PlatformEvent[] }>('/discover/events/', {
      params: {
        ...(params?.category ? { category: params.category } : {}),
        ...(params?.city ? { city: params.city } : {}),
        ...(params?.featured ? { featured: '1' } : {}),
      },
    })
  },
  get(ref: string) {
    return client.get<PlatformEvent>(`/discover/events/${encodeURIComponent(ref)}/`)
  },
  purchase(ref: string, body: {
    ticket_class_id: number
    quantity: number
    attendee_name?: string
    attendee_email?: string
    attendee_phone?: string
  }) {
    return client.post<TicketPurchase>(`/discover/events/${encodeURIComponent(ref)}/tickets/purchase/`, body)
  },
  myTickets() {
    return client.get<{ results: MyTicketRow[] }>('/discover/events/my-tickets/')
  },
  initiatePayment(body: {
    event_ticket_purchase_id: number
    amount: number
    redirect_url?: string
    cancel_url?: string
  }) {
    return client.post<{
      payment_ref?: string
      payment_gateway_url?: string
      ticket_code?: string
    }>('/payments/selcom/event-tickets/initiate/', body)
  },
}
