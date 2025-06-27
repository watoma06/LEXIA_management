"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { useEffect, useMemo, useState } from "react"
import { supabase, TABLE_NAME, PROJECTS_TABLE } from "@/lib/supabase"
import { RecordItem } from "@/components/vault-table"
import { AddProjectDialog, NewProject } from "@/components/add-project-dialog"

type ProjectProgressRecord = {
  id: string
  project_name: string
  client_name: string
  status: string
  due_date: string
  unit_price: number
}

export default function KgiKpiPage() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [projects, setProjects] = useState<ProjectProgressRecord[]>([])

  useEffect(() => {
    supabase
      .from(TABLE_NAME)
      .select("*")
      .then(({ data }) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [])

  useEffect(() => {
    supabase
      .from(PROJECTS_TABLE)
      .select('*')
      .then(({ data }) => setProjects(data ?? []))
      .catch(() => setProjects([]))
  }, [])

  const handleAddProject = async (project: NewProject) => {
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .insert(project)
      .select()
      .single()

    if (error) {
      console.error('Insert project error:', error.message)
      return
    }
    if (data) setProjects((prev) => [...prev, data as ProjectProgressRecord])
  }

  const kgiTarget = 1500000

  const currentYear = new Date().getFullYear()

  const kgiCurrent = useMemo(() => {
    return records
      .filter(
        (r) =>
          r.category === "Income" &&
          new Date(r.date).getFullYear() === currentYear
      )
      .reduce((sum, r) => sum + r.amount, 0)
  }, [records, currentYear])

  const kgiPercent = Math.round((kgiCurrent / kgiTarget) * 100)
  const remaining = kgiTarget - kgiCurrent

  const uniqueItems = useMemo(() => {
    return new Set(records.map((r) => r.item_id || r.item)).size
  }, [records])

  const completedItems = useMemo(() => {
    return new Set(
      records
        .filter((r) => r.category === "Income")
        .map((r) => r.item_id || r.item)
    ).size
  }, [records])

  const kpiTarget = uniqueItems || 1
  const kpiCompleted = completedItems
  const kpiInProgress = kpiTarget - kpiCompleted
  const kpiCompletedRatio = kpiTarget ? kpiCompleted / kpiTarget : 0
  const kpiInProgressRatio = kpiTarget ? kpiInProgress / kpiTarget : 0
  const kpiData = [
    { name: "完了", value: kpiCompletedRatio },
    { name: "進行中", value: kpiInProgressRatio },
  ]

  const monthlySales = useMemo(() => {
    const lastYear = currentYear - 1
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const thisYear = records
        .filter(
          (r) =>
            r.category === "Income" &&
            new Date(r.date).getFullYear() === currentYear &&
            new Date(r.date).getMonth() + 1 === month
        )
        .reduce((sum, r) => sum + r.amount, 0)
      const lastYearVal = records
        .filter(
          (r) =>
            r.category === "Income" &&
            new Date(r.date).getFullYear() === lastYear &&
            new Date(r.date).getMonth() + 1 === month
        )
        .reduce((sum, r) => sum + r.amount, 0)
      return {
        month: `${month}月`,
        thisYear,
        lastYear: lastYearVal,
      }
    })
  }, [records, currentYear])

  const monthlyProjects = useMemo(() => {
    const lastYear = currentYear - 1
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const thisYear = new Set(
        records
          .filter(
            (r) =>
              r.category === "Income" &&
              new Date(r.date).getFullYear() === currentYear &&
              new Date(r.date).getMonth() + 1 === month
          )
          .map((r) => r.item_id || r.item)
      ).size
      const lastYearVal = new Set(
        records
          .filter(
            (r) =>
              r.category === "Income" &&
              new Date(r.date).getFullYear() === lastYear &&
              new Date(r.date).getMonth() + 1 === month
          )
          .map((r) => r.item_id || r.item)
      ).size
      return {
        month: `${month}月`,
        thisYear,
        lastYear: lastYearVal,
      }
    })
  }, [records, currentYear])

  const monthlySummary = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const income = records
        .filter(
          (r) =>
            r.category === "Income" &&
            new Date(r.date).getFullYear() === currentYear &&
            new Date(r.date).getMonth() + 1 === month
        )
        .reduce((sum, r) => sum + r.amount, 0)
      const expense = records
        .filter(
          (r) =>
            r.category === "Expense" &&
            new Date(r.date).getFullYear() === currentYear &&
            new Date(r.date).getMonth() + 1 === month
        )
        .reduce((sum, r) => sum + r.amount, 0)
      return {
        month: `${month}月`,
        income,
        expense,
        profit: income - expense,
      }
    })
  }, [records, currentYear])

  const statusMap: Record<string, number> = {
    "制作待ち": 0,
    "進行中": 50,
    "完了": 100,
  }

  const projectRows = useMemo(
    () =>
      projects.map((p) => ({
        name: p.project_name,
        client: p.client_name,
        progress: statusMap[p.status] ?? 0,
        due: p.due_date,
        price: p.unit_price,
      })),
    [projects]
  )

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

  const metrics = useMemo(() => {
    const clients = new Set(records.map((r) => r.client)).size
    const incomeRecords = records.filter((r) => r.category === "Income")
    const expenseRecords = records.filter((r) => r.category === "Expense")
    const closingRate =
      incomeRecords.length + expenseRecords.length === 0
        ? 0
        :
          Math.round(
            (incomeRecords.length /
              (incomeRecords.length + expenseRecords.length)) *
              100
          )
    const avgPrice =
      incomeRecords.length === 0
        ? 0
        :
          Math.round(
            incomeRecords.reduce((sum, r) => sum + r.amount, 0) /
              incomeRecords.length
          )
    const itemDates = new Map<string, { first: number; last: number }>()
    records.forEach((r) => {
      const key = String(r.item_id || r.item)
      const ts = new Date(r.date).getTime()
      if (!itemDates.has(key)) itemDates.set(key, { first: ts, last: ts })
      else {
        const v = itemDates.get(key)!
        if (ts < v.first) v.first = ts
        if (ts > v.last) v.last = ts
      }
    })
    const avgDelivery = itemDates.size
      ? Math.round(
          Array.from(itemDates.values()).reduce(
            (sum, { first, last }) => sum + (last - first) / 86400000,
            0
          ) / itemDates.size
        )
      : 0
    const satisfaction = totals.income
      ? Math.round((totals.profit / totals.income) * 100)
      : 0

    return [
      { title: "新規商談数", value: `${clients}件` },
      { title: "成約率", value: `${closingRate}%` },
      { title: "平均制作単価", value: `¥${avgPrice.toLocaleString()}` },
      { title: "納品期間平均", value: `${avgDelivery}日` },
      { title: "顧客満足度", value: `${satisfaction}%` },
    ]
  }, [records, totals])

  const month = new Date().getMonth() + 1
  const predicted = Math.round((kgiCurrent / month) * 12)

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold">KGI・KPIダッシュボード</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>KGI進捗サマリー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-end justify-between text-sm font-medium">
              <span>年間売上目標 150万円</span>
              <span>{kgiPercent}% 達成 / あと{Math.round(remaining / 10000)}万円</span>
            </div>
            <Progress value={kgiPercent} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KPI進捗サマリー</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <div className="h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={kpiData}
                    innerRadius={40}
                    outerRadius={60}
                    label
                  >
                    <Cell fill="hsl(var(--primary))" />
                    <Cell fill="hsl(var(--muted))" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm">
              今月の制作目標 {kpiTarget}件 - 完了 {kpiCompleted}件 / 進行中 {kpiInProgress}件
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>月別売上推移</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySales} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="thisYear" stroke="#ff6b00" strokeWidth={2} />
                    <Line type="monotone" dataKey="lastYear" stroke="#888" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>月別制作件数推移</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyProjects} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="thisYear" fill="hsl(var(--primary))" />
                    <Bar dataKey="lastYear" fill="hsl(var(--muted-foreground))" opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>月別収支表</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>月</TableHead>
                  <TableHead className="text-right">収入</TableHead>
                  <TableHead className="text-right">支出</TableHead>
                  <TableHead className="text-right">利益</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlySummary.map((m) => (
                  <TableRow key={m.month}>
                    <TableCell>{m.month}</TableCell>
                    <TableCell className="text-right">
                      ¥{m.income.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ¥{m.expense.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ¥{m.profit.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>案件進捗・ステータス一覧</CardTitle>
            <AddProjectDialog onAdd={handleAddProject} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>案件名</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>進捗</TableHead>
                  <TableHead>納期</TableHead>
                  <TableHead className="text-right">制作単価</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectRows.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.client}</TableCell>
                    <TableCell className="w-40">
                      <Progress value={p.progress} className="h-2" />
                    </TableCell>
                    <TableCell>{p.due}</TableCell>
                    <TableCell className="text-right">¥{p.price.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-5">
          {metrics.map((m) => (
            <Card key={m.title} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{m.value}</CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>アクション・ヒント</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              今月は新規商談獲得に注力しましょう！売上目標まであと{Math.round(remaining / 10000)}万円です。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>年間売上予測</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">現状ペースでは年間売上は¥{predicted.toLocaleString()}になる見込みです。</p>
            {predicted < kgiTarget && (
              <p className="mt-2 text-sm text-destructive">目標未達の可能性があります。</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
