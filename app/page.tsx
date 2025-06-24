"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { CategoryChart } from "@/components/category-chart"
import { RecordsTable, RecordItem } from "@/components/vault-table"
import { AddRecordDialog, NewRecord } from "@/components/add-record-dialog"
import { EditRecordDialog } from "@/components/edit-record-dialog"
import DashboardLayout from "@/components/dashboard-layout"
import { supabase, TABLE_NAME } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DatePicker } from "@/components/date-picker"

export default function Page() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const { session } = useAuth()

  const [editing, setEditing] = useState<RecordItem | null>(null)
  const [startDate, setStartDate] = useState("2025-01-01")
  const [endDate, setEndDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  useEffect(() => {
    if (!session) return
    supabase
      .from(TABLE_NAME)
      .select("*")
      .eq('user_id', session.user.id)
      .then(({ data }) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [session])

  const handleAdd = async (record: NewRecord) => {
    if (!session) return
    const { data } = await supabase
      .from(TABLE_NAME)
      .insert({ ...record, user_id: session.user.id })
      .select()
      .single()
    if (data) setRecords((prev) => [...prev, data as RecordItem])
  }

  const handleImport = async (records: NewRecord[]) => {
    if (!session) return
    const payload = records.map((r) => ({ ...r, user_id: session.user.id }))
    const { data } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
    if (data) setRecords((prev) => [...prev, ...(data as RecordItem[])])
  }

  const handleUpdate = async (updated: RecordItem) => {
    if (!session) return
    const { data } = await supabase
      .from(TABLE_NAME)
      .update(updated)
      .eq("id", updated.id)
      .eq('user_id', session.user.id)
      .select()
      .single()
    if (data)
      setRecords((prev) =>
        prev.map((r) => (r.id === (data as RecordItem).id ? (data as RecordItem) : r))
      )
  }

  const handleDelete = async (id: number) => {
    if (!session) return
    await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id)
      .eq('user_id', session.user.id)
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
            <PopoverContent className="w-64 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm">開始日</label>
                <DatePicker date={startDate} onChange={setStartDate} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm">終了日</label>
                <DatePicker date={endDate} onChange={setEndDate} />
              </div>
            </PopoverContent>
          </Popover>
          <AddRecordDialog onAdd={handleAdd} onImport={handleImport} />
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
