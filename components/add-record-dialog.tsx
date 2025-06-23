import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type NewRecord = {
  category: "Income" | "Expense"
  type: "維持費" | "制作費" | "その他"
  date: string
  amount: number
  client: string
  item: string
  note: string
}

interface AddRecordDialogProps {
  onAdd: (record: NewRecord) => void
}

export function AddRecordDialog({ onAdd }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<NewRecord>({
    category: "Income",
    type: "維持費",
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    client: "",
    item: "",
    note: "",
  })

  const handleChange = (key: keyof NewRecord, value: any) => {
    setForm({ ...form, [key]: value })
  }

  const handleSubmit = () => {
    onAdd({ ...form, amount: Number(form.amount) })
    setOpen(false)
    setForm({
      category: "Income",
      type: "維持費",
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      client: "",
      item: "",
      note: "",
    })
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
          <label className="text-sm">タイプ</label>
          <Select value={form.type} onValueChange={(v) => handleChange("type", v as NewRecord["type"])}>
            <SelectTrigger>
              <SelectValue placeholder="タイプ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="維持費">維持費</SelectItem>
              <SelectItem value="制作費">制作費</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">日付</label>
          <Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
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
          <Input value={form.item} onChange={(e) => handleChange("item", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">備考</label>
          <Textarea value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>完了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
