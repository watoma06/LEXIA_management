import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export const TABLE_NAME = process.env.NEXT_PUBLIC_SUPABASE_TABLE || 'records'
export const PROJECTS_TABLE =
  process.env.NEXT_PUBLIC_SUPABASE_PROJECTS_TABLE || 'project_progress'
export const SUBSCRIPTIONS_TABLE =
  process.env.NEXT_PUBLIC_SUPABASE_SUBSCRIPTIONS_TABLE || 'subscriptions'

// 予約システムで利用するテーブル名
export const BOOKINGS_TABLE =
  process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE || 'bookings'
