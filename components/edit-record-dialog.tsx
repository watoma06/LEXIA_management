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
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { RecordItem } from "./vault-table"
import { ACCOUNT_TYPES } from "@/lib/accountTypes"
import { supabase, ITEMS_TABLE } from "@/lib/supabase"

interface EditRecordDialogProps {
  record: RecordItem
  onEdit: (record: RecordItem) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function EditRecordDialog({ record, onEdit, open = false, onOpenChange, trigger }: EditRecordDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open)
  const [items, setItems] = useState<{ id: number; name: string }[]>([])
  const [form, setForm] = useState<RecordItem>(record)

  useEffect(() => {
    supabase
      .from(ITEMS_TABLE)
      .select('*')
      .then(({ data }) => setItems(data ?? []))
      .catch(() => setItems([]))
  }, [])

  useEffect(() => {
    setForm(record)
  }, [record])

  useEffect(() => {
    setInternalOpen(open)
  }, [open])

  const handleChange = (key: keyof RecordItem, value: any) => {
    setForm({ ...form, [key]: value })
  }

  const handleSubmit = () => {
    onEdit({ ...form, amount: Number(form.amount) })
    if (onOpenChange) {
      onOpenChange(false)
    } else {
      setInternalOpen(false)
    }
  }

  return (
    <Dialog
      open={onOpenChange ? open : internalOpen}
      onOpenChange={(v) => {
        onOpenChange ? onOpenChange(v) : setInternalOpen(v)
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>レコード編集</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <label className="text-sm">カテゴリ</label>
          <Select value={form.category} onValueChange={(v) => handleChange("category", v as RecordItem["category"])}>
            <SelectTrigger>
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Income">収入</SelectItem>
              <SelectItem value="Expense">支出</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">勘定科目</label>
          <Select value={form.type} onValueChange={(v) => handleChange("type", v as RecordItem["type"])}>
            <SelectTrigger>
              <SelectValue placeholder="勘定科目" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">日付</label>
          <DatePicker date={form.date} onChange={(v) => handleChange("date", v)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">金額</label>
          <Input type="number" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">相手先／クライアント</label>
          <Input value={form.client} onChange={(e) => handleChange("client", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">品目</label>
          <Input
            value={form.item}
            onChange={(e) => {
              const value = e.target.value
              handleChange("item", value)
              const found = items.find((i) => i.name === value)
              handleChange("item_id", found ? found.id : 0)
            }}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">備考</label>
          <Textarea value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
