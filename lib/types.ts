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
