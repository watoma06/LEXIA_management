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
import { supabase, SUBSCRIPTIONS_TABLE } from "@/lib/supabase"
import type { Subscription } from "@/lib/types"

interface EditRecordDialogProps {
  record: RecordItem
  onEdit: (record: RecordItem) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function EditRecordDialog({ record, onEdit, open = false, onOpenChange, trigger }: EditRecordDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [form, setForm] = useState<RecordItem>(record)
  const [percentage, setPercentage] = useState("")

  useEffect(() => {
    supabase
      .from(SUBSCRIPTIONS_TABLE)
      .select('*')
      .then(({ data }) => setSubscriptions(data ?? []))
      .catch(() => setSubscriptions([]))
  }, [])

  useEffect(() => {
    setForm(record)
  }, [record])

  useEffect(() => {
    setInternalOpen(open)
  }, [open])

  const handleChange = (key: keyof RecordItem, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onEdit({ ...form, amount: Number(form.amount) })
    if (onOpenChange) {
      onOpenChange(false)
    } else {
      setInternalOpen(false)
    }
  }

  const handleCalculate = () => {
    const pct = parseFloat(percentage)
    const amt = parseFloat(String(form.amount))
    if (!isNaN(pct) && !isNaN(amt)) {
      const result = amt * (pct / 100)
      handleChange("amount", result)
    }
  }

  const handleConvert = async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD")
      const data = await res.json()
      const rate = data?.rates?.JPY
      const amt = parseFloat(String(form.amount))
      if (rate && !isNaN(amt)) {
        handleChange("amount", (amt * rate).toFixed(2))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const applySubscription = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id)
    if (sub) {
      setForm((prev) => ({
        ...prev,
        category: sub.category,
        type: sub.type,
        amount: sub.amount,
        client: sub.client,
        item: sub.item,
        notes: sub.notes,
      }))
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
      <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto">
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
              <SelectItem value="Income" className="text-green-500">
                収入
              </SelectItem>
              <SelectItem value="Expense" className="text-red-500">
                支出
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">勘定科目</label>
          <Select value={form.type} onValueChange={(v) => handleChange("type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="勘定科目" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
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
          <div className="flex items-center gap-2">
            <Input type="number" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} />
            <Button type="button" variant="outline" onClick={handleConvert}>ドル→円</Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="w-20"
              placeholder="0"
            />
            <span>%</span>
            <Button type="button" variant="outline" onClick={handleCalculate}>
              計算
            </Button>
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">相手先／クライアント</label>
          <Input value={form.client} onChange={(e) => handleChange("client", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">名称</label>
          <Input
            value={form.item}
            onChange={(e) => handleChange("item", e.target.value)}
          />
        </div>
        {subscriptions.length > 0 && (
          <div className="grid gap-2">
            <label className="text-sm">サブスクから入力</label>
            <Select onValueChange={applySubscription}>
              <SelectTrigger>
                <SelectValue placeholder="選択" />
              </SelectTrigger>
              <SelectContent>
                {subscriptions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="grid gap-2">
          <label className="text-sm">備考</label>
          <Textarea value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
