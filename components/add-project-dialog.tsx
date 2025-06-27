"use client"

import { useState } from "react"
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

export type NewProject = {
  project_name: string
  client_name: string
  status: string
  due_date: string
  unit_price: number
}

interface AddProjectDialogProps {
  onAdd: (project: NewProject) => void
  className?: string
}

export function AddProjectDialog({ onAdd, className }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<NewProject>({
    project_name: "",
    client_name: "",
    status: "制作待ち",
    due_date: new Date().toISOString().slice(0, 10),
    unit_price: 0,
  })

  const handleChange = (key: keyof NewProject, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onAdd({ ...form, unit_price: Number(form.unit_price) })
    setOpen(false)
    setForm({
      project_name: "",
      client_name: "",
      status: "制作待ち",
      due_date: new Date().toISOString().slice(0, 10),
      unit_price: 0,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>追加</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>案件追加</DialogTitle>
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
          <Button onClick={handleSubmit}>完了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
