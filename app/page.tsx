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
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"

export default function Page() {
  const [records, setRecords] = useState<RecordItem[]>([])

  const [editing, setEditing] = useState<RecordItem | null>(null)

  useEffect(() => {
    supabase
      .from(TABLE_NAME)
      .select("*")
      .then(({ data }) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [])

  const handleAdd = async (record: NewRecord) => {
    const { data } = await supabase
      .from(TABLE_NAME)
      .insert(record)
      .select()
      .single()
    if (data) {
      setRecords((prev) => [...prev, data as RecordItem])
      toast({ title: "レコードを追加しました" })
    }
  }

  const handleImport = async (records: NewRecord[]) => {
    const { data } = await supabase
      .from(TABLE_NAME)
      .insert(records)
      .select()
    if (data) {
      setRecords((prev) => [...prev, ...(data as RecordItem[])])
      toast({ title: "レコードをインポートしました" })
    }
  }

  const handleUpdate = async (updated: RecordItem) => {
    const { data } = await supabase
      .from(TABLE_NAME)
      .update(updated)
      .eq("id", updated.id)
      .select()
      .single()
    if (data) {
      setRecords((prev) =>
        prev.map((r) => (r.id === (data as RecordItem).id ? (data as RecordItem) : r))
      )
      toast({ title: "レコードを更新しました" })
    }
  }

  const handleDelete = async (id: number) => {
    await supabase.from(TABLE_NAME).delete().eq("id", id)
    setRecords((prev) => prev.filter((r) => r.id !== id))
    toast({ title: "レコードを削除しました" })
  }

  const profitChartData = useMemo(() => {
    const map = new Map<string, number>()
    records.forEach((r) => {
      const key = format(new Date(r.date), "yyyy-MM")
      const value = r.category === "Income" ? r.amount : -r.amount
      map.set(key, (map.get(key) || 0) + value)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([k, v]) => ({ date: format(new Date(k + "-01"), "M月"), value: v }))
  }, [records])

  const categoryData = useMemo(() => {
    const map = new Map<string, number>()
    records.forEach((r) => {
      if (r.category === "Expense") {
        map.set(r.type, (map.get(r.type) || 0) + r.amount)
      }
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [records])

  const totals = useMemo(() => {
    return records.reduce(
      (acc, r) => {
        if (r.category === "Income") acc.income += r.amount
        else acc.expense += r.amount
        acc.profit = acc.income - acc.expense
        return acc
      },
      { income: 0, expense: 0, profit: 0 }
    )
  }, [records])

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">財務概要</h1>
          <div className="text-sm text-muted-foreground">
            {new Date('2025-01-01').toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            -{' '}
            {new Date().toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            会計期間
            <ChevronDown className="h-4 w-4" />
          </Button>
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
          records={records}
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
