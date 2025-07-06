import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

import AdminPage from '../admin/page'

let realtimeCallback: (() => void) | null = null
let currentData: any[] = []

const channel = {
  on: vi.fn((_event: string, _filter: any, cb: () => void) => {
    realtimeCallback = cb
    return channel
  }),
  subscribe: vi.fn(() => channel)
}

const supabaseMock = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      order: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: currentData, error: null }))
      }))
    }))
  })),
  channel: vi.fn(() => channel),
  removeChannel: vi.fn()
}

vi.mock('@/lib/supabaseClient', () => ({
  createSupabaseClient: () => supabaseMock
}))

vi.mock('@/lib/supabase', () => ({
  BOOKINGS_TABLE: 'bookings'
}))

vi.mock('@/components/dashboard-layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

beforeEach(() => {
  currentData = []
  realtimeCallback = null
  vi.clearAllMocks()
})

test('updates bookings when realtime event occurs', async () => {
  render(<AdminPage />)

  await screen.findByText('予約はありません')

  currentData = [
    { id: 1, appointment_date: '2024-01-01', appointment_time: '11:00', patient_name: 'Test' }
  ]

  realtimeCallback && realtimeCallback()

  await waitFor(() => {
    expect(screen.getByText('Test', { exact: false })).toBeInTheDocument()
  })
})
