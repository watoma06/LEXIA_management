"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"

export type ProjectRecord = {
  id: string
  project_name: string
  client_name: string
  status: string
  due_date: string
  unit_price: number
  sort_order: number
}

interface EditProjectDialogProps {
  project: ProjectRecord
  onEdit: (project: ProjectRecord) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function EditProjectDialog({ project, onEdit, open = false, onOpenChange, trigger }: EditProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open)
  const [form, setForm] = useState<ProjectRecord>(project)

  useEffect(() => {
    setForm(project)
  }, [project])

  useEffect(() => {
    setInternalOpen(open)
  }, [open])

  const handleChange = (key: keyof ProjectRecord, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onEdit({ ...form, unit_price: Number(form.unit_price) })
    if (onOpenChange) {
      onOpenChange(false)
    } else {
      setInternalOpen(false)
    }
  }

  return (
    <Dialog open={onOpenChange ? open : internalOpen} onOpenChange={(v) => { onOpenChange ? onOpenChange(v) : setInternalOpen(v) }}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>案件編集</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <label className="text-sm">案件名</label>
          <Input value={form.project_name} onChange={(e) => handleChange("project_name", e.target.value)} placeholder="案件名" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">顧客名</label>
          <Input value={form.client_name} onChange={(e) => handleChange("client_name", e.target.value)} placeholder="顧客名" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">進捗</label>
          <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
            <SelectTrigger>
              <SelectValue placeholder="進捗" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="制作待ち">制作待ち</SelectItem>
              <SelectItem value="進行中">進行中</SelectItem>
              <SelectItem value="完了">完了</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">納期</label>
          <DatePicker date={form.due_date} onChange={(v) => handleChange("due_date", v)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">制作単価</label>
          <Input type="number" value={form.unit_price} onChange={(e) => handleChange("unit_price", e.target.value)} placeholder="0" />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
