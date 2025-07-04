"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, PROJECTS_TABLE, TABLE_NAME } from "@/lib/supabase"
import { useEffect, useState, useMemo } from "react"
import { AddProjectDialog, NewProject } from "@/components/add-project-dialog"
import { EditProjectDialog } from "@/components/edit-project-dialog"
import { ProjectProgressTable, ProjectProgressRecord } from "@/components/project-progress-table"
import ProjectCalendar from "@/components/project-calendar"
import ProjectGanttChart from "@/components/project-gantt-chart"
import type { RecordItem } from "@/components/vault-table"
import { formatNumber } from "@/lib/utils"

export default function TodoPage() {
  const [projects, setProjects] = useState<ProjectProgressRecord[]>([])
  const [editing, setEditing] = useState<ProjectProgressRecord | null>(null)
  const [records, setRecords] = useState<RecordItem[]>([])

  useEffect(() => {
    supabase
      .from(PROJECTS_TABLE)
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => setProjects(data ?? []))
      .catch(() => setProjects([]))
  }, [])

  useEffect(() => {
    supabase
      .from(TABLE_NAME)
      .select('*')
      .then(({ data }) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [])

  const handleAddProject = async (project: NewProject) => {
    const nextOrder = projects.reduce((max, p) => Math.max(max, p.sort_order), -1) + 1
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
      ;[newProjects[idx], newProjects[swapIdx]] = [newProjects[swapIdx], newProjects[idx]]
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

  const metrics = useMemo(() => {
    const newDeals = projects.length
    const avgPrice =
      projects.length === 0
        ? 0
        : Math.round(
            projects.reduce((sum, p) => sum + p.unit_price, 0) / projects.length
          )

    return [
      { title: "新規商談数", value: `${newDeals}件` },
      { title: "平均制作単価", value: `¥${formatNumber(avgPrice)}` },
    ]
  }, [projects])

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
      <h1 className="mb-6 text-2xl font-bold">Todo</h1>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Todo</CardTitle>
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

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        {metrics.map((m) => (
          <Card key={m.title} className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{m.value}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>アクション・ヒント</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            納期が近い案件が{dueSoon}件あります。早めに対応して売上目標まであと
            {Math.round((kgiTarget - (kgiCurrent + upcomingRevenue)) / 10000)}万円を確実に達成しましょう。
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>スケジュールカレンダー</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectCalendar projects={projects} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>簡易ガントチャート</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectGanttChart projects={projects} />
        </CardContent>
      </Card>

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
