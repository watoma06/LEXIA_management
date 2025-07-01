"use client"

import { useMemo } from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'
import type { ProjectProgressRecord } from "./project-progress-table"
import { format } from "date-fns"

interface ProjectCalendarProps {
  projects: ProjectProgressRecord[]
}

export default function ProjectCalendar({ projects }: ProjectCalendarProps) {
  const dateMap = useMemo(() => {
    const map: Record<string, ProjectProgressRecord[]> = {}
    projects.forEach((p) => {
      const key = p.due_date
      if (!map[key]) map[key] = []
      map[key].push(p)
    })
    return map
  }, [projects])

  return (
    <Calendar
      tileContent={({ date, view }) => {
        if (view !== 'month') return null
        const key = format(date, 'yyyy-MM-dd')
        const list = dateMap[key]
        if (!list) return null
        return (
          <ul className="mt-1 space-y-1">
            {list.map((p) => (
              <li key={p.id} className="text-[10px] truncate">
                {p.project_name}
              </li>
            ))}
          </ul>
        )
      }}
    />
  )
}
