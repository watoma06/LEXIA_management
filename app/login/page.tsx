"use client"

import { useState, FormEvent } from "react"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })

    const result = schema.safeParse({ email, password })
    if (!result.success) {
      setError("入力が正しくありません")
      return
    }

    try {
      await signIn(email, password)
      router.push('/')
    } catch (err: any) {
      console.error(err)
      setError("ログインに失敗しました")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold mb-4">LEXIA management system</h1>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button type="submit" className="w-full">Login</Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm text-center">
          アカウントをお持ちでないですか？ <Link href="/signup" className="underline">新規登録</Link>
        </p>
      </form>
    </div>
  )
}
