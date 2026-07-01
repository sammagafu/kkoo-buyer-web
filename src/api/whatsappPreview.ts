import client from '@/api/client'

export type WhatsAppPreviewResponse = {
  token: string
  entity_type: string
  entity_id: number
  status: string
  public_visible: boolean
  product?: {
    id: number
    title: string
    description: string
    base_price: number
    verification_status: string
    media?: { file: string; is_primary?: boolean }[]
  }
  document?: {
    id: number
    document_type?: string
    file_path?: string
    file?: string
    status: string
  }
}

export async function fetchWhatsAppPreview(token: string): Promise<WhatsAppPreviewResponse> {
  const { data } = await client.get<WhatsAppPreviewResponse>(
    `/whatsapp/preview/${encodeURIComponent(token)}/`,
  )
  return data
}
