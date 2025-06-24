"use client"

import { useState, useRef, ChangeEvent, useEffect } from "react"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ACCOUNT_TYPES, AccountType } from "@/lib/accountTypes"
import { supabase, ITEMS_TABLE } from "@/lib/supabase"

export type NewRecord = {
  category: "Income" | "Expense"
  type: AccountType
  date: string
  amount: number
  client: string
  item: string
  item_id: number
  note: string
}

interface AddRecordDialogProps {
  onAdd: (record: NewRecord) => void
  onImport?: (records: NewRecord[]) => void
}

export function AddRecordDialog({ onAdd, onImport }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<{ id: number; name: string }[]>([])
  const [form, setForm] = useState<NewRecord>({
    category: "Income",
    type: ACCOUNT_TYPES[0],
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    client: "",
    item: "",
    item_id: 0,
    note: "",
  })

  useEffect(() => {
    supabase
      .from(ITEMS_TABLE)
      .select('*')
      .then(({ data }) => setItems(data ?? []))
      .catch(() => setItems([]))
  }, [])

  const handleChange = (key: keyof NewRecord, value: any) => {
    setForm({ ...form, [key]: value })
  }

  const handleSubmit = () => {
    onAdd({ ...form, amount: Number(form.amount) })
    setOpen(false)
    setForm({
      category: "Income",
      type: ACCOUNT_TYPES[0],
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      client: "",
      item: "",
      item_id: 0,
      note: "",
    })
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
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
          item_id: Number(r.item_id || 0),
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
      <DialogContent className="space-y-4">
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
              <SelectItem value="Income">収入</SelectItem>
              <SelectItem value="Expense">支出</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">勘定科目</label>
          <Select value={form.type} onValueChange={(v) => handleChange("type", v as NewRecord["type"])}>
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
