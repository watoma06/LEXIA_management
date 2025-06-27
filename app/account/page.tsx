"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AccountPage() {
  const { user, updateEmail, resetPassword } = useAuth()
  const [email, setEmail] = useState(user?.email ?? "")
  const [message, setMessage] = useState<string | null>(null)
  const [resetMsg, setResetMsg] = useState<string | null>(null)

  const handleEmailChange = async () => {
    setMessage(null)
    try {
      await updateEmail(email)
      setMessage("メールアドレスを更新しました")
    } catch (e: any) {
      setMessage(e.message)
    }
  }

  const handleReset = async () => {
    setResetMsg(null)
    try {
      await resetPassword(email)
      setResetMsg("リセットメールを送信しました")
    } catch (e: any) {
      setResetMsg(e.message)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">アカウント</h1>
      <div className="space-y-6 max-w-sm">
        <div>
          <p className="text-sm text-muted-foreground">現在のメールアドレス</p>
          <p className="font-semibold">{user?.email}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm">メールアドレス変更</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleEmailChange}>更新</Button>
          {message && <p className="text-sm text-destructive">{message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm">パスワードリセット</label>
          <Button onClick={handleReset}>リセットメール送信</Button>
          {resetMsg && <p className="text-sm text-destructive">{resetMsg}</p>}
        </div>
      </div>
    </DashboardLayout>
  )
}
