"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      <div className="grid gap-4 max-w-xs">
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
      </div>
    </DashboardLayout>
  )
}
