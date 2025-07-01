"use client"

import { differenceInDays, format } from 'date-fns'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import type { ProjectProgressRecord } from './project-progress-table'

interface ProjectGanttChartProps {
  projects: ProjectProgressRecord[]
}

export default function ProjectGanttChart({ projects }: ProjectGanttChartProps) {
  const now = new Date()
  const data = projects.map(p => ({
    name: p.project_name,
    days: Math.max(differenceInDays(new Date(p.due_date), now), 0)
  }))
  return (
    <div className="h-[300px] w-full max-w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: '残日数', position: 'insideBottomRight', offset: -5 }} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip formatter={(v) => `${v}日`} />
          <Bar dataKey="days" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
