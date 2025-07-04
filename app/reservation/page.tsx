"use client"

import { useEffect, useState } from "react"
  useEffect(() => {
    supabase
      .from(BOOKINGS_TABLE)

        <h2 className="font-semibold mb-2">予約リスト</h2>
        <ul className="space-y-1">
          {bookings.map((b) => (
            <li key={b.id} className="border p-2 rounded">

  )
}
