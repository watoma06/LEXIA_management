import { supabase } from './supabase'
import { toast } from '@/hooks/use-toast'

export async function signIn(email: string, password: string) {
  const { error, data } = await supabase.auth.signInWithPassword({ email, password })
  if (!error) {
    toast({ title: 'ログインしました' })
  }
  return { error, data }
}

export async function signUp(email: string, password: string) {
  const { error, data } = await supabase.auth.signUp({ email, password })
  if (!error) {
    toast({ title: 'サインアップが完了しました' })
  }
  return { error, data }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    toast({ title: 'ログアウトしました' })
  }
  return { error }
}
