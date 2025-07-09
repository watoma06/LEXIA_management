"use client"

import { useState, useRef, ChangeEvent, useEffect } from "react"
import { z } from "zod"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ACCOUNT_TYPES } from "@/lib/accountTypes"
import { supabase, SUBSCRIPTIONS_TABLE } from "@/lib/supabase"
import type { Subscription } from "@/lib/types"

export type NewRecord = {
  category: "Income" | "Expense"
  type: string
  date: string
  amount: number
  client: string
  item: string
  notes: string
}

interface AddRecordDialogProps {
  onAdd: (record: NewRecord) => void
  onImport?: (records: NewRecord[]) => void
}

export function AddRecordDialog({ onAdd, onImport }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [form, setForm] = useState<NewRecord>({
    category: "Income",
    type: ACCOUNT_TYPES[0],
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    client: "",
    item: "",
    notes: "",
  })
  const [percentage, setPercentage] = useState("")

  useEffect(() => {
    supabase
      .from(SUBSCRIPTIONS_TABLE)
      .select('*')
      .then(({ data }) => setSubscriptions(data ?? []))
      .catch(() => setSubscriptions([]))
  }, [])

  const handleChange = (key: keyof NewRecord, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const schema = z.object({
      category: z.enum(["Income", "Expense"]),
      type: z.string().nonempty(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      amount: z.preprocess((v) => Number(v), z.number().nonnegative()),
      client: z.string().optional(),
      item: z.string().optional(),
      notes: z.string().optional(),
    })

    const result = schema.safeParse(form)
    if (!result.success) {
      alert("入力内容を確認してください")
      return
    }

    const payload = {
      ...result.data,
    }
    onAdd(payload)
    setOpen(false)
    setForm({
      category: "Income",
      type: ACCOUNT_TYPES[0],
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      client: "",
      item: "",
      notes: "",
    })
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
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
        category: sub.category as NewRecord["category"],
        type: sub.type,
        amount: sub.amount,
        client: sub.client,
        item: sub.item,
        notes: sub.notes,
      }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse<NewRecord>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const records = (results.data as any[]).map((r) => ({
          ...r,
          amount: Number(r.amount),
        })) as NewRecord[]
        if (onImport) records.length && onImport(records)
        else records.forEach((r) => onAdd(r))
      },
    })
    e.target.value = ""
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">追加</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新規レコード追加</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <label className="text-sm">カテゴリ</label>
          <Select value={form.category} onValueChange={(v) => handleChange("category", v as NewRecord["category"])}>
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
        <DialogFooter className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="outline" onClick={handleImportClick}>
            インポート
          </Button>
          <Button onClick={handleSubmit}>完了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
