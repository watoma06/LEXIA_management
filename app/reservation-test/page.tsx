"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { supabase, BOOKINGS_TABLE } from "@/lib/supabase"
import Link from "next/link"

export default function ReservationTestPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  })
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setMessage(null)
    const { error } = await supabase.from(BOOKINGS_TABLE).insert({
      patient_name: form.name,
      phone: form.phone,
      email: form.email,
      appointment_date: form.date,
      appointment_time: form.time,
      notes: form.notes,
      status: "pending",
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage("予約を受け付けました")
      setForm({ name: "", phone: "", email: "", date: "", time: "", notes: "" })
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">予約システムテスト</h1>
      <div className="grid gap-4 max-w-md">
        <div className="grid gap-2">
          <label className="text-sm">お名前</label>
          <Input value={form.name} onChange={e => handleChange("name", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">電話番号</label>
          <Input value={form.phone} onChange={e => handleChange("phone", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">メール</label>
          <Input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">予約日</label>
          <Input type="date" value={form.date} onChange={e => handleChange("date", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">時間</label>
          <Input value={form.time} onChange={e => handleChange("time", e.target.value)} placeholder="例: 10:00" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">備考</label>
          <Textarea value={form.notes} onChange={e => handleChange("notes", e.target.value)} />
        </div>
        <Button onClick={handleSubmit}>予約する</Button>
        {message && <p className="text-sm text-destructive">{message}</p>}
        <Link href="/reservation-test/admin" className="text-sm underline block mt-4">
          管理者画面へ
        </Link>
      </div>
    </DashboardLayout>
  )
}
