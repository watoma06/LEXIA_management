import { createClient } from '@supabase/supabase-js'

export const createSupabaseClient = () =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )

export default createSupabaseClient
