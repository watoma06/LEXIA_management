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
import { formatNumber } from "@/lib/utils"
import { RecordItem } from "@/components/vault-table"
import { AddProjectDialog, NewProject } from "@/components/add-project-dialog"
import { EditProjectDialog } from "@/components/edit-project-dialog"
import { ProjectProgressTable, ProjectProgressRecord } from "@/components/project-progress-table"

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
      .order('sort_order', { ascending: true })
      .then(({ data }) => setProjects(data ?? []))
      .catch(() => setProjects([]))
  }, [])

  const handleAddProject = async (project: NewProject) => {
    const nextOrder =
      projects.reduce((max, p) => Math.max(max, p.sort_order), -1) + 1
    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .insert({ ...project, sort_order: nextOrder })
      .select()
      .single()

    if (error) {
      console.error('Insert project error:', error.message)
      return
    }
    if (data) setProjects((prev) => [...prev, data as ProjectProgressRecord])
  }

  const handleUpdateProject = async (project: ProjectProgressRecord) => {
    const { data } = await supabase
      .from(PROJECTS_TABLE)
      .update(project)
      .eq('id', project.id)
      .select()
      .single()
    if (data)
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? (data as ProjectProgressRecord) : p))
      )
  }

  const handleDeleteProject = async (id: string) => {
    await supabase.from(PROJECTS_TABLE).delete().eq('id', id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const moveProject = async (id: string, direction: "up" | "down") => {
    let updates: { id: string; sort_order: number }[] = []
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === id)
      if (idx === -1) return prev
      const swapIdx = direction === "up" ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= prev.length) return prev
      const newProjects = [...prev]
      ;[newProjects[idx], newProjects[swapIdx]] = [
        newProjects[swapIdx],
        newProjects[idx],
      ]
      newProjects.forEach((p, i) => {
        p.sort_order = i
      })
      updates = newProjects.map((p) => ({ id: p.id, sort_order: p.sort_order }))
      return newProjects
    })
    if (updates.length) {
      await supabase.from(PROJECTS_TABLE).upsert(updates)
    }
  }

  const [editing, setEditing] = useState<ProjectProgressRecord | null>(null)

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
    return new Set(records.map((r) => r.item)).size
  }, [records])

  const completedItems = useMemo(() => {
    return new Set(
      records
        .filter((r) => r.category === "Income")
        .map((r) => r.item)
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
          .map((r) => r.item)
      ).size
      const lastYearVal = new Set(
        records
          .filter(
            (r) =>
              r.category === "Income" &&
              new Date(r.date).getFullYear() === lastYear &&
              new Date(r.date).getMonth() + 1 === month
          )
          .map((r) => r.item)
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
    const newDeals = projects.length
    const avgPrice =
      projects.length === 0
        ? 0
        : Math.round(
            projects.reduce((sum, p) => sum + p.unit_price, 0) /
              projects.length
          )

    return [
      { title: "新規商談数", value: `${newDeals}件` },
      { title: "平均制作単価", value: `¥${formatNumber(avgPrice)}` },
    ]
  }, [projects])

  const upcomingRevenue = useMemo(() => {
    return projects
      .filter((p) => p.status !== "完了")
      .reduce((sum, p) => sum + p.unit_price, 0)
  }, [projects])

  const dueSoon = useMemo(() => {
    const now = Date.now()
    const week = 7 * 86400000
    return projects.filter(
      (p) =>
        p.status !== "完了" &&
        new Date(p.due_date).getTime() - now <= week &&
        new Date(p.due_date).getTime() - now >= 0
    ).length
  }, [projects])

  const month = new Date().getMonth() + 1
  const predicted = Math.round((kgiCurrent / month) * 12)
  const predictedWithProjects = predicted + upcomingRevenue

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
                      ¥{formatNumber(m.income)}
                    </TableCell>
                    <TableCell className="text-right">
                      ¥{formatNumber(m.expense)}
                    </TableCell>
                    <TableCell className="text-right">
                      ¥{formatNumber(m.profit)}
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
            <AddProjectDialog onAdd={handleAddProject} className="ml-auto" />
          </CardHeader>
          <CardContent>
            <ProjectProgressTable
              projects={projects}
              onEdit={(p) => setEditing(p)}
              onDelete={handleDeleteProject}
              onUpdate={handleUpdateProject}
              onMove={(id, dir) => moveProject(id, dir)}
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
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
              納期が近い案件が{dueSoon}件あります。早めに対応して売上目標まであと{Math.round(
                (kgiTarget - (kgiCurrent + upcomingRevenue)) / 10000
              )}
              万円を確実に達成しましょう。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>年間売上予測</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              進行中の案件を含めると年間売上は¥{formatNumber(predictedWithProjects)}になる見込みです。
            </p>
            {predictedWithProjects < kgiTarget && (
              <p className="mt-2 text-sm text-destructive">目標未達の可能性があります。</p>
            )}
          </CardContent>
        </Card>
      </div>
      {editing && (
        <EditProjectDialog
          project={editing}
          onEdit={(p) => {
            handleUpdateProject(p)
            setEditing(null)
          }}
          open={true}
          onOpenChange={(v) => !v && setEditing(null)}
        />
      )}
    </DashboardLayout>
  )
}
