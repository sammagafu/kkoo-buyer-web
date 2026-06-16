import client from './client'

export type PartnerScope =
  | 'discover:read'
  | 'events:read'
  | 'hotels:read'
  | 'restaurants:read'
  | 'menu:read'
  | 'careers:read'
  | 'tickets:read'

export const partnersApi = {
  listScopes() {
    return client.get<{ results: PartnerScope[] }>('/partners/scopes/')
  },
  register(body: {
    company_name: string
    contact_name: string
    contact_email: string
    contact_phone?: string
    website?: string
    country?: string
    use_case?: string
    requested_scopes?: PartnerScope[]
  }) {
    return client.post<{
      message?: string
      application_uuid?: string
      status?: string
      available_scopes?: PartnerScope[]
    }>('/partners/register/', body)
  },
  registrationStatus(params: { email?: string; application_uuid?: string }) {
    return client.get<{
      application_uuid?: string
      status?: string
      company_name?: string
      reviewed_at?: string | null
      partner_id?: number | null
    }>('/partners/register/status/', { params })
  },
}
