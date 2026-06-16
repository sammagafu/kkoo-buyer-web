import client from './client'

export type CareerPosting = {
  id: number
  uuid: string
  title: string
  slug: string
  description: string
  department?: string
  location?: string
  employment_type?: string
  requirements?: string
  application_deadline?: string | null
  status?: string
  published_at?: string | null
}

export const careersApi = {
  list(params?: { department?: string; employment_type?: string }) {
    return client.get<{ results: CareerPosting[] }>('/careers/postings/', { params })
  },
  get(ref: string) {
    return client.get<CareerPosting>(`/careers/postings/${encodeURIComponent(ref)}/`)
  },
  apply(ref: string, form: FormData) {
    return client.post<{ message?: string; application_uuid?: string }>(
      `/careers/postings/${encodeURIComponent(ref)}/apply/`,
      form,
    )
  },
}
