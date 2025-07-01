"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, PROJECTS_TABLE } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { AddProjectDialog, NewProject } from "@/components/add-project-dialog"
import { EditProjectDialog } from "@/components/edit-project-dialog"
import { ProjectProgressTable, ProjectProgressRecord } from "@/components/project-progress-table"

export default function TodoPage() {
  const [projects, setProjects] = useState<ProjectProgressRecord[]>([])
  const [editing, setEditing] = useState<ProjectProgressRecord | null>(null)

  useEffect(() => {
    supabase
      .from(PROJECTS_TABLE)
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => setProjects(data ?? []))
      .catch(() => setProjects([]))
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

