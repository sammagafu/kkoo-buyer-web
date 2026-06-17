import client from './client'

/** User disputes (auth). API.md: GET/POST /disputes/, GET /disputes/:id/ */
export const disputesUserApi = {
  list(params?: { page?: number; page_size?: number; status?: string }) {
    return client.get<{ results: unknown[] }>('/disputes/', { params })
  },
  get(id: number | string) {
    return client.get(`/disputes/${id}/`)
  },
  create(data: {
    subject_type: 'order' | 'rider_payment'
    subject_id: number
    reason: string
    description?: string
  }) {
    return client.post('/disputes/', data)
  },
  addEvidence(id: number | string, formData: FormData) {
    return client.post(`/disputes/${id}/evidence/`, formData)
  },
}

/** Admin disputes. API.md: GET /disputes/admin/ (status, subject_type: order | rider_payment), POST /disputes/:id/resolve/ */
export const disputesAdminApi = {
  list(params?: { page?: number; page_size?: number; status?: string; subject_type?: 'order' | 'rider_payment' }) {
    return client.get<{ results: unknown[] }>('/disputes/admin/', { params })
  },
  resolve(id: number, data: { resolution: string; admin_notes?: string }) {
    return client.post(`/disputes/${id}/resolve/`, data)
  },
}
