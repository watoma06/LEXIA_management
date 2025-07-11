"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DatePicker } from "@/components/date-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart, ChartDataItem } from "@/components/stats-chart"
import { CategoryChart, CategoryData } from "@/components/category-chart"
import { RecordsTable, RecordItem } from "@/components/vault-table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AddRecordDialog, NewRecord } from "@/components/add-record-dialog"
import { EditRecordDialog } from "@/components/edit-record-dialog"
import DashboardLayout from "@/components/dashboard-layout"
import { supabase, TABLE_NAME } from "@/lib/supabase"
import { formatNumber } from "@/lib/utils"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"

export default function Page() {
  const { user } = useAuth()
  const router = useRouter()
  const [records, setRecords] = useState<RecordItem[]>([])

  const [editing, setEditing] = useState<RecordItem | null>(null)
  const [startDate, setStartDate] = useState("2025-01-01")
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [range, setRange] = useState<"1y" | "6m" | "1m">("1y")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])


  useEffect(() => {
    supabase
      .from(TABLE_NAME)
      .select("*")
      .then(({ data }) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [])

  const handleAdd = async (record: NewRecord) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(record)
      .select()
      .single()
    if (error) {
      console.error('Insert error:', error.message)
      return
    }
    if (data) setRecords((prev) => [...prev, data as RecordItem])
  }

  const handleImport = async (records: NewRecord[]) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(records)
      .select()
    if (error) {
      console.error('Bulk insert error:', error.message)
      return
    }
    if (data) setRecords((prev) => [...prev, ...(data as RecordItem[])])
  }

  const handleUpdate = async (updated: RecordItem) => {
    const { data } = await supabase
      .from(TABLE_NAME)
      .update(updated)
      .eq("id", updated.id)
      .select()
      .single()
    if (data)
      setRecords((prev) =>
        prev.map((r) => (r.id === (data as RecordItem).id ? (data as RecordItem) : r))
      )
  }

  const handleDelete = async (id: number) => {
    await supabase.from(TABLE_NAME).delete().eq("id", id)
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const d = new Date(r.date)
      if (startDate && d < new Date(startDate)) return false
      if (endDate && d > new Date(endDate)) return false
      return true
    })
  }, [records, startDate, endDate])

  const profitChartData = useMemo(() => {
    const sorted = [...filteredRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    const map = new Map<string, number>()
    let cumulative = 0
    sorted.forEach((r) => {
      const key = format(new Date(r.date), "yyyy-MM")
      const value = r.category === "Income" ? r.amount : -r.amount
      cumulative += value
      map.set(key, cumulative)
    })
    const data = Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([k, v]) => ({ date: format(new Date(k + "-01"), "M月"), value: v }))
    const limit = range === "1m" ? 1 : range === "6m" ? 6 : 12
    return data.slice(-limit) as ChartDataItem[]
  }, [filteredRecords, range])

  const categoryData = useMemo<CategoryData[]>(() => {
    const map = new Map<string, Map<string, number>>()
    filteredRecords.forEach((r) => {
      if (r.category === "Expense") {
        const month = format(new Date(r.date), "yyyy-MM")
        if (!map.has(month)) map.set(month, new Map())
        const m = map.get(month)!
        m.set(r.type, (m.get(r.type) || 0) + r.amount)
      }
    })
    const data = Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([k, v]) => {
        const obj: Record<string, number | string> = {
          date: format(new Date(k + "-01"), "M月"),
        }
        v.forEach((val, type) => {
          obj[type] = val
        })
        return obj
      })
    const limit = range === "1m" ? 1 : range === "6m" ? 6 : 12
    return data.slice(-limit) as CategoryData[]
  }, [filteredRecords, range])

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

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">財務概要</h1>
          <div className="text-sm text-muted-foreground">
            {new Date(startDate).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            -{' '}
            {new Date(endDate).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                会計期間
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 space-y-4">
              <div className="grid gap-2">
                <label className="text-sm">開始日</label>
                <DatePicker date={startDate} onChange={setStartDate} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">終了日</label>
                <DatePicker date={endDate} onChange={setEndDate} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">表示範囲</label>
                <Select
                  value={range}
                  onValueChange={(v) => setRange(v as "1y" | "6m" | "1m")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1y">1年</SelectItem>
                    <SelectItem value="6m">半年</SelectItem>
                    <SelectItem value="1m">1ヶ月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStartDate("2025-01-01")
                  setEndDate(new Date().toISOString().slice(0, 10))
                }}
              >
                リセット
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricsCard
          title="総収入"
          value={`¥${formatNumber(totals.income)}`}
        />
        <MetricsCard
          title="総支出"
          value={`¥${formatNumber(totals.expense)}`}
        />
        <MetricsCard
          title="純利益"
          value={`¥${formatNumber(totals.profit)}`}
        />
      </div>
      <Card className="mt-6 p-6">
        <Accordion type="single" collapsible defaultValue="profit">
          <AccordionItem value="profit">
            <AccordionTrigger className="text-lg font-semibold">
              月別純利益
            </AccordionTrigger>
            <AccordionContent>
              <StatsChart data={profitChartData} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <Card className="mt-6 p-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="category">
            <AccordionTrigger className="text-lg font-semibold">
              勘定科目別支出割合
            </AccordionTrigger>
            <AccordionContent>
              <CategoryChart data={categoryData} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <div className="mt-6">
        <AddRecordDialog onAdd={handleAdd} onImport={handleImport} />
      </div>
      <div className="mt-6">
        <RecordsTable
          records={filteredRecords}
          onEdit={(r) => setEditing(r)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
      {editing && (
        <EditRecordDialog
          record={editing}
          onEdit={(r) => {
            handleUpdate(r)
            setEditing(null)
          }}
          open={true}
          onOpenChange={(v) => !v && setEditing(null)}
        />
      )}
    </DashboardLayout>
  )
}
