"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KgiKpiPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">KGI・KPI</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>KGI</CardTitle>
          </CardHeader>
          <CardContent>
            <p>最終的な目標達成度を測る指標をここに表示します。</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <p>KGI達成のための重要な指標をここに表示します。</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
