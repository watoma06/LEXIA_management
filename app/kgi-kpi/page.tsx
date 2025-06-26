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

export default function KgiKpiPage() {
  const kgiTarget = 1500000
  const kgiCurrent = 900000
  const kgiPercent = Math.round((kgiCurrent / kgiTarget) * 100)
  const remaining = kgiTarget - kgiCurrent

  const kpiTarget = 1
  const kpiCompleted = 0.6
  const kpiInProgress = kpiTarget - kpiCompleted
  const kpiData = [
    { name: "完了", value: kpiCompleted },
    { name: "進行中", value: kpiInProgress },
  ]

  const monthlySales = [
    { month: "1月", thisYear: 120, lastYear: 100 },
    { month: "2月", thisYear: 150, lastYear: 130 },
    { month: "3月", thisYear: 200, lastYear: 160 },
    { month: "4月", thisYear: 180, lastYear: 170 },
    { month: "5月", thisYear: 220, lastYear: 210 },
    { month: "6月", thisYear: 250, lastYear: 230 },
  ]

  const monthlyProjects = [
    { month: "1月", thisYear: 1, lastYear: 0 },
    { month: "2月", thisYear: 0, lastYear: 1 },
    { month: "3月", thisYear: 1, lastYear: 0 },
    { month: "4月", thisYear: 1, lastYear: 1 },
    { month: "5月", thisYear: 0, lastYear: 1 },
    { month: "6月", thisYear: 1, lastYear: 0 },
  ]

  const projects = [
    {
      name: "サイトA",
      client: "顧客A",
      progress: 0.8,
      due: "2024-07-31",
      price: 500000,
    },
    {
      name: "サイトB",
      client: "顧客B",
      progress: 1,
      due: "2024-06-15",
      price: 300000,
    },
    {
      name: "サイトC",
      client: "顧客C",
      progress: 0.4,
      due: "2024-08-20",
      price: 450000,
    },
  ]

  const metrics = [
    { title: "新規商談数", value: "5件" },
    { title: "成約率", value: "60%" },
    { title: "平均制作単価", value: "¥400,000" },
    { title: "納品期間平均", value: "30日" },
    { title: "顧客満足度", value: "90%" },
  ]

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
            <CardTitle>案件進捗・ステータス一覧</CardTitle>
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
                {projects.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.client}</TableCell>
                    <TableCell className="w-40">
                      <Progress value={p.progress * 100} className="h-2" />
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
