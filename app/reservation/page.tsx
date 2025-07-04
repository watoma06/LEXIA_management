"use client"

import { useEffect, useState } from "react"
import { CalendarClock } from "lucide-react"
import { supabase, BOOKINGS_TABLE } from "@/lib/supabase"
import type { Booking } from "@/lib/types"

export default function ReservationPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    supabase
      .from(BOOKINGS_TABLE)
      .select('*')
      .then(({ data }) => setBookings(data ?? []))
      .catch(() => setBookings([]))
  }, [])

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarClock />予約ページ
      </h1>
      <iframe
        src="https://example.com/reservation"
        className="w-full max-w-2xl h-[600px] border"
        loading="lazy"
      />
      <div className="w-full max-w-2xl mt-4">
        <h2 className="font-semibold mb-2">予約リスト</h2>
        <ul className="space-y-1">
          {bookings.map((b) => (
            <li key={b.id} className="border p-2 rounded">
              <span>{b.name} - {b.date}</span>
              {b.notes && <span className="block text-sm text-muted-foreground">{b.notes}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
