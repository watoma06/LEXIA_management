"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { supabase, BOOKINGS_TABLE } from "@/lib/supabase"
import type { Booking } from "@/lib/types"
import { Card } from "@/components/ui/card"

export default function ReservationAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    supabase
      .from(BOOKINGS_TABLE)
      .select("*")
      .order("appointment_date", { ascending: true })
      .then(({ data }) => setBookings(data ?? []))
      .catch(() => setBookings([]))
  }, [])

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">予約管理</h1>
      <div className="space-y-2">
        {bookings.map((b) => (
          <Card key={b.id} className="p-4">
            <div className="font-semibold">
              {b.appointment_date} {b.appointment_time} / {b.patient_name}
            </div>
            <div className="text-sm text-muted-foreground">{b.phone} / {b.email}</div>
            {b.notes && <div className="text-sm mt-1">{b.notes}</div>}
          </Card>
        ))}
        {bookings.length === 0 && <p className="text-sm">予約はありません</p>}
      </div>
    </DashboardLayout>
  )
}
