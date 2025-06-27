import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export const TABLE_NAME = process.env.NEXT_PUBLIC_SUPABASE_TABLE || 'records'
export const ITEMS_TABLE = 'items'
export const PROJECTS_TABLE =
  process.env.NEXT_PUBLIC_SUPABASE_PROJECTS_TABLE || 'project_progress'
