export interface Subscription {
  id: string
  name: string
  category: 'Income' | 'Expense'
  type: string
  amount: number
  client: string
  item: string
  notes: string
}

export interface Booking {
  id: string
  patient_name: string
  phone: string
  email: string
  appointment_date: string
  appointment_time: string
  notes: string | null
  status: string
  created_at: string
}
