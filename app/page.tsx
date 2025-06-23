"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { RecordsTable, RecordItem } from "@/components/vault-table"
import { MobileNav } from "@/components/mobile-nav"
import { AddRecordDialog, NewRecord } from "@/components/add-record-dialog"
import { EditRecordDialog } from "@/components/edit-record-dialog"
import { format } from "date-fns"
import {
  BarChart3,
  ChevronDown,
  Globe,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Wallet,
} from "lucide-react"

export default function Page() {
  const [records, setRecords] = useState<RecordItem[]>([
    {
      id: 1,
      category: "Income",
      type: "制作費",
      date: "2024-05-10",
      amount: 13643,
      client: "顧客A",
      item: "Web制作",
      note: "初期契約",
    },
    {
      id: 2,
      category: "Expense",
      type: "維持費",
      date: "2024-05-12",
      amount: 1200,
      client: "事務用品店",
      item: "文房具",
      note: "",
    },
  ])

  const [editing, setEditing] = useState<RecordItem | null>(null)

  const handleAdd = (record: NewRecord) => {
    setRecords((prev) => [
      ...prev,
      { id: prev.length + 1, ...record },
    ])
  }

  const handleUpdate = (updated: RecordItem) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const chartData = useMemo(() => {
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

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center h-16 gap-2 border-b px-4 lg:hidden">
        <MobileNav />
        <Wallet className="h-6 w-6" />
        <span className="font-bold">LEXIA Finance</span>
      </header>
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-background/50 backdrop-blur lg:block">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Wallet className="h-6 w-6" />
            <span className="font-bold">LEXIAファイナンス</span>
          </div>
          <div className="px-4 py-4">
            <Input placeholder="検索" className="bg-background/50" />
          </div>
          <nav className="space-y-2 px-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              ダッシュボード
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              収入と支出
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Globe className="h-4 w-4" />
              レポート
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              予算
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Wallet className="h-4 w-4" />
              アカウント
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LifeBuoy className="h-4 w-4" />
              サポート
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              設定
            </Button>
          </nav>
        </aside>
        <main className="p-6">
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
              <AddRecordDialog onAdd={handleAdd} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="総収入"
              value="¥74,892"
              change={{ value: "¥1,340", percentage: "+2.1%", isPositive: true }}
            />
            <MetricsCard
              title="総支出"
              value="¥54,892"
              change={{ value: "¥1,340", percentage: "-1.3%", isPositive: false }}
            />
            <MetricsCard
              title="純利益"
              value="¥20,000"
              change={{ value: "¥1,340", percentage: "+1.2%", isPositive: true }}
            />
          </div>
          <Card className="mt-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">キャッシュフロー</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  先月
                </Button>
                <Button size="sm" variant="ghost">
                  過去6か月
                </Button>
                <Button size="sm" variant="ghost">
                  今年
                </Button>
              </div>
            </div>
            <StatsChart data={chartData} />
          </Card>
          <div className="mt-6">
            <RecordsTable
              records={records}
              onEdit={(r) => setEditing(r)}
              onDelete={handleDelete}
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
        </main>
      </div>
    </div>
  )
}
