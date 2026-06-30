import client from './client'

export type MedicineReminder = {
  id?: number
  medicine_name?: string
  dosage?: string
  frequency?: string
  reminder_times?: string[] | string
  timezone?: string
  next_reminder_at?: string
  last_taken_at?: string | null
  is_active?: boolean
  notes?: string
  product_id?: number | null
  prescriber_name?: string
  assignment_source?: 'self' | 'doctor' | 'pharmacist' | string
  assigned_by_user_id?: number | null
  prescription_id?: number | null
}

export type PharmacyPrescription = {
  id?: number
  file_url?: string
  status?: string
  notes?: string
  created_at?: string
}

export type PharmacyRefill = {
  id?: number
  medicine_name?: string
  status?: string
  notes?: string
  created_at?: string
}

/** Auth. API.md: /pharmacy/* — reminders, prescriptions, refills. */
export const pharmacyApi = {
  listReminders() {
    return client.get<{ results?: MedicineReminder[] } | MedicineReminder[]>('/pharmacy/reminders/')
  },
  createReminder(data: {
    medicine_name: string
    dosage?: string
    frequency?: string
    reminder_times?: string[]
    product_id?: number
    notes?: string
  }) {
    return client.post<MedicineReminder>('/pharmacy/reminders/', data)
  },
  updateReminder(id: number, data: Partial<MedicineReminder>) {
    return client.patch<MedicineReminder>(`/pharmacy/reminders/${id}/`, data)
  },
  deleteReminder(id: number) {
    return client.delete(`/pharmacy/reminders/${id}/`)
  },
  markReminderTaken(id: number) {
    return client.post<MedicineReminder>(`/pharmacy/reminders/${id}/taken/`)
  },
  /** Pharmacist/seller: assign dose schedule to a patient (from prescription). */
  assignReminder(data: {
    patient_phone?: string
    patient_user_id?: number
    prescriber_name?: string
    prescription_id?: number
    medicine_name: string
    dosage?: string
    frequency?: string
    reminder_times?: string[]
    notes?: string
  }) {
    return client.post<MedicineReminder>('/pharmacy/reminders/assign/', data)
  },
  uploadPrescription(formData: FormData) {
    return client.post<PharmacyPrescription>('/pharmacy/prescriptions/upload/', formData)
  },
  listPrescriptions() {
    return client.get<{ results?: PharmacyPrescription[] } | PharmacyPrescription[]>('/pharmacy/prescriptions/')
  },
  listRefills() {
    return client.get<{ results?: PharmacyRefill[] } | PharmacyRefill[]>('/pharmacy/refills/')
  },
  createRefill(data: { medicine_name: string; notes?: string }) {
    return client.post<PharmacyRefill>('/pharmacy/refills/', data)
  },
}
