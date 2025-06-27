"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, updateEmail, resetPassword } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState(user?.email ?? "")
  const [message, setMessage] = useState<string | null>(null)
  const [resetMsg, setResetMsg] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    if (user?.email) setEmail(user.email)
  }, [user])
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
  if (!mounted) return null

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      <div className="grid gap-6 max-w-sm">
        <div className="grid gap-2">
          <label className="text-sm">テーマ</label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger>
              <SelectValue placeholder="テーマを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">ライトモード</SelectItem>
              <SelectItem value="dark">ダークモード</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
