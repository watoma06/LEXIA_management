"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase, TABLE_NAME } from "@/lib/supabase"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { CategoryChart } from "@/components/category-chart"
import { RecordsTable, RecordItem } from "@/components/vault-table"
import { DatePicker } from "@/components/date-picker"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import Papa from "papaparse"

export default function ReportsPage() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    supabase
      .from(TABLE_NAME)
      .select("*")
      .then(({ data }) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [])

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const d = new Date(r.date)
      if (startDate && d < new Date(startDate)) return false
      if (endDate && d > new Date(endDate)) return false
      return true
    })
  }, [records, startDate, endDate])

  const totals = useMemo(() => {
    return filteredRecords.reduce(
      (acc, r) => {
        if (r.category === "Income") acc.income += r.amount
        else acc.expense += r.amount
        acc.profit = acc.income - acc.expense
        return acc
      },
      { income: 0, expense: 0, profit: 0 }
    )
  }, [filteredRecords])

  const profitChartData = useMemo(() => {
    const map = new Map<string, number>()
    filteredRecords.forEach((r) => {
      const key = format(new Date(r.date), "yyyy-MM")
      const value = r.category === "Income" ? r.amount : -r.amount
      map.set(key, (map.get(key) || 0) + value)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([k, v]) => ({ date: format(new Date(k + "-01"), "M月"), value: v }))
  }, [filteredRecords])

  const categoryData = useMemo(() => {
    const map = new Map<string, number>()
    filteredRecords.forEach((r) => {
      if (r.category === "Expense") {
        map.set(r.type, (map.get(r.type) || 0) + r.amount)
      }
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [filteredRecords])

  const handleExport = () => {
    const csv = Papa.unparse(filteredRecords)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "records.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-2xl font-bold mb-6">レポート</h1>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="grid gap-2">
          <label className="text-sm">開始日</label>
          <DatePicker date={startDate} onChange={setStartDate} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">終了日</label>
          <DatePicker date={endDate} onChange={setEndDate} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricsCard
          title="総収入"
          value={`¥${totals.income.toLocaleString()}`}
        />
        <MetricsCard
          title="総支出"
          value={`¥${totals.expense.toLocaleString()}`}
        />
        <MetricsCard
          title="純利益"
          value={`¥${totals.profit.toLocaleString()}`}
        />
      </div>
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold mb-4">月別純利益</h2>
        <StatsChart data={profitChartData} />
      </Card>
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold mb-4">カテゴリ別支出割合</h2>
        <CategoryChart data={categoryData} />
      </Card>
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={handleExport}>
          CSVダウンロード
        </Button>
      </div>
      <div className="mt-6">
        <RecordsTable records={filteredRecords} />
      </div>
    </div>
  )
}
