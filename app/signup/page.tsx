"use client"

import { useState, FormEvent } from "react"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"

export default function SignUpPage() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

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
      await signUp(email, password)
      setOpen(true)
    } catch (err: any) {
      console.error(err)
      setError("登録に失敗しました")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
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
        <Button type="submit" className="w-full">Sign Up</Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm text-center">
          すでにアカウントをお持ちですか？ <Link href="/login" className="underline">ログイン</Link>
        </p>
      </form>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認メールを送信しました</DialogTitle>
            <DialogDescription>
              ご入力いただいたメールアドレス宛に認証メールをお送りしました。メールをご確認ください。
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
