"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { supabase, BOOKINGS_TABLE } from "@/lib/supabase"
import Link from "next/link"

const TIMES = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

export default function ReservationPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [bookings, setBookings] = useState<any[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from(BOOKINGS_TABLE)
      .select("*")
      .eq("appointment_date", date)
      .then(({ data }) => setBookings(data ?? []))
  }, [date])

  const handleSubmit = async () => {
    if (!selectedTime) return
    const { error } = await supabase.from(BOOKINGS_TABLE).insert({
      patient_name: form.name,
      phone: form.phone,
      email: form.email,
      appointment_date: date,
      appointment_time: selectedTime,
      notes: form.notes,
      status: "pending",
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage("予約を受け付けました")
      setSelectedTime(null)
      setForm({ name: "", phone: "", email: "", notes: "" })
      supabase
        .from(BOOKINGS_TABLE)
        .select("*")
        .eq("appointment_date", date)
        .then(({ data }) => setBookings(data ?? []))
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">予約画面</h1>
      <div className="mb-4 max-w-xs">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <table className="w-full border mb-6 text-center">
        <tbody>
          {TIMES.map((t) => {
            const booked = bookings.some((b) => b.appointment_time === t)
            return (
              <tr key={t} className="border-b">
                <td className="p-2">{t}</td>
                <td className="p-2">
                  {booked ? (
                    "×"
                  ) : (
                    <button onClick={() => setSelectedTime(t)} className="text-lg">
                      〇
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {selectedTime && (
        <div className="grid gap-4 max-w-md mb-4">
          <h2 className="font-semibold">
            {date} {selectedTime} の予約
          </h2>
          <div className="grid gap-2">
            <label className="text-sm">お名前</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">電話番号</label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">メール</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">備考</label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <Button onClick={handleSubmit}>予約する</Button>
          {message && <p className="text-sm text-destructive">{message}</p>}
        </div>
      )}
      <Link href="/reservation/admin" className="text-sm underline">
        管理画面へ
      </Link>
    </DashboardLayout>
  )
}
