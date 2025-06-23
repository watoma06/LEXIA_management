"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { date: "3月", value: 300 },
  { date: "4月", value: 350 },
  { date: "5月", value: 200 },
  { date: "6月", value: 400 },
  { date: "7月", value: 300 },
  { date: "8月", value: 200 },
  { date: "9月", value: 450 },
  { date: "10月", value: 500 },
  { date: "11月", value: 480 },
  { date: "12月", value: 400 },
  { date: "1月", value: 350 },
  { date: "2月", value: 400 },
]

export function StatsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">値</span>
                        <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">日付</span>
                        <span className="font-bold">{payload[0].payload.date}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#ff6b00" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
