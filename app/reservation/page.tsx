"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react"
import { supabase, BOOKINGS_TABLE } from "@/lib/supabase"
import type { Booking } from "@/lib/types"
import Link from "next/link"
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  subDays,
  addMonths,
  subMonths,
} from "date-fns"
import { ja } from 'date-fns/locale'

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

type ViewMode = "weekly" | "monthly"

export default function ReservationPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("weekly")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })
  const [message, setMessage] = useState<string | null>(null)

  const dateRange =
    viewMode === "weekly"
      ? eachDayOfInterval({ start: startOfWeek(currentDate, { weekStartsOn: 1 }), end: endOfWeek(currentDate, { weekStartsOn: 1 }) })
      : eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })

  useEffect(() => {
    const startDate = format(dateRange[0], "yyyy-MM-dd")
    const endDate = format(dateRange[dateRange.length - 1], "yyyy-MM-dd")

    supabase
      .from(BOOKINGS_TABLE)
      .select("*")
      .gte("appointment_date", startDate)
      .lte("appointment_date", endDate)
      .then(({ data }) => setBookings(data ?? []))
      .catch(() => setBookings([]))
  }, [currentDate, viewMode, dateRange])

  const handlePrev = () => {
    if (viewMode === "weekly") {
      setCurrentDate(subDays(currentDate, 7))
    } else {
      setCurrentDate(subMonths(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (viewMode === "weekly") {
      setCurrentDate(addDays(currentDate, 7))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  const handleSubmit = async () => {
    if (!selectedSlot) return
    const { error } = await supabase.from(BOOKINGS_TABLE).insert({
      patient_name: form.name,
      phone: form.phone,
      email: form.email,
      appointment_date: selectedSlot.date,
      appointment_time: selectedSlot.time,
      notes: form.notes,
      status: "pending",
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage("予約を受け付けました")
      setSelectedSlot(null)
      setForm({ name: "", phone: "", email: "", notes: "" })
      // Refetch bookings
      const startDate = format(dateRange[0], "yyyy-MM-dd")
      const endDate = format(dateRange[dateRange.length - 1], "yyyy-MM-dd")
      supabase
        .from(BOOKINGS_TABLE)
        .select("*")
        .gte("appointment_date", startDate)
        .lte("appointment_date", endDate)
        .then(({ data }) => setBookings(data ?? []))
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <CalendarClock />
        予約画面
      </h1>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <Button variant="outline" onClick={handlePrev} className="mr-2">
            <ChevronLeft size={20} />
          </Button>
          <Button variant="outline" onClick={handleNext}>
            <ChevronRight size={20} />
          </Button>
          <span className="ml-4 font-semibold">
            {format(dateRange[0], "yyyy年M月d日")} - {format(dateRange[dateRange.length - 1], "M月d日")}
          </span>
        </div>
        <div>
          <Button
            variant={viewMode === "weekly" ? "default" : "outline"}
            onClick={() => setViewMode("weekly")}
            className="mr-2"
          >
            週間
          </Button>
          <Button
            variant={viewMode === "monthly" ? "default" : "outline"}
            onClick={() => setViewMode("monthly")}
          >
            月間
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border mb-6 text-center">
          <thead>
            <tr className="border-b">
              <th className="p-2 border-r w-24 h-24 align-middle"></th>
              {TIMES.map((time) => (
                <th key={time} className="p-2 border-r w-24 h-24 align-middle">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dateRange.map((day) => (
              <tr key={day.toString()} className="border-b">
                <td className="p-2 border-r w-24 h-24 align-middle">
                  <div>{format(day, "M/d", { locale: ja })}</div>
                  <div>({format(day, "EEEEE", { locale: ja })})</div>
                </td>
                {TIMES.map((time) => {
                  const dayStr = format(day, "yyyy-MM-dd")
                  const booked = bookings.some(
                    (b) => b.appointment_date === dayStr && b.appointment_time === time,
                  )
                  return (
                    <td key={time + day.toString()} className="p-2 border-r w-24 h-24 flex items-center justify-center">
                      {booked ? (
                        <span className="text-red-500 text-lg w-8 h-8 flex items-center justify-center">×</span>
                      ) : (
                        <button
                          onClick={() => setSelectedSlot({ date: dayStr, time })}
                          className="text-green-500 text-lg hover:bg-green-100 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          〇
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">凡例:</h3>
        <div className="flex items-center gap-4 text-sm">
          <div><span className="text-green-500 font-bold">〇</span>: 空き</div>
          <div><span className="text-red-500 font-bold">×</span>: 予約済み</div>
        </div>
      </div>

      {selectedSlot && (
        <div className="grid gap-4 max-w-md mb-4">
          <h2 className="font-semibold">
            {selectedSlot.date} {selectedSlot.time} の予約
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
          <Button variant="outline" onClick={() => setSelectedSlot(null)}>
            キャンセル
          </Button>
          {message && <p className="text-sm text-destructive">{message}</p>}
        </div>
      )}
      <Link href="/reservation/admin" className="text-sm underline">
        管理画面へ
      </Link>
      {/* The old daily booking list is removed for now, can be added back if needed */}
      {/* <div className="w-full max-w-md mt-6"> ... </div> */}
    </DashboardLayout>
  )
}
