"use client"

import React, { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { createSupabaseClient } from "@/lib/supabaseClient"
import { BOOKINGS_TABLE } from "@/lib/supabase"
import type { Booking } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createSupabaseClient()

    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from(BOOKINGS_TABLE)
        .select("*")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })

      if (error) {
        toast({
          title: "エラー",
          description: "予約データの取得に失敗しました",
          variant: "destructive",
        })
        setBookings([])
      } else {
        setBookings(data ?? [])
      }
    }

    fetchBookings()

    const channel = supabase
      .channel("admin_booking_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: BOOKINGS_TABLE },
        fetchBookings
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [toast])

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">予約一覧</h1>
      <div className="space-y-2">
        {bookings.map((b) => (
          <div key={b.id} className="border p-4 rounded">
            <div className="font-semibold">
              {b.appointment_date} {b.appointment_time} / {b.patient_name}
            </div>
            <div className="text-sm text-muted-foreground">
              {b.phone} / {b.email}
            </div>
            {b.notes && <div className="text-sm mt-1">{b.notes}</div>}
          </div>
        ))}
        {bookings.length === 0 && <p className="text-sm">予約はありません</p>}
      </div>
    </DashboardLayout>
  )
}
