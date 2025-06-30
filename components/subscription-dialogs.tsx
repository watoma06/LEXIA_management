"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ACCOUNT_TYPES } from "@/lib/accountTypes"
import { supabase } from "@/lib/supabase"
import type { Subscription } from "@/lib/types"

interface AddProps {
  onAdd: (sub: Omit<Subscription, 'id'>) => void
}

export function AddSubscriptionDialog({ onAdd }: AddProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Omit<Subscription, 'id'>>({
    name: '',
    category: 'Expense',
    type: ACCOUNT_TYPES[0],
    amount: 0,
    client: '',
    item: '',
    notes: '',
  })

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const payload = {
      ...form,
      amount: Number(form.amount),
    }
    onAdd(payload)
    setOpen(false)
    setForm({
      name: '',
      category: 'Expense',
      type: ACCOUNT_TYPES[0],
      amount: 0,
      client: '',
      item: '',
      notes: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">追加</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>サブスク追加</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <label className="text-sm">名前</label>
          <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">カテゴリ</label>
          <Select value={form.category} onValueChange={(v) => handleChange('category', v)}>
            <SelectTrigger>
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Income" className="text-green-500">収入</SelectItem>
              <SelectItem value="Expense" className="text-red-500">支出</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">勘定科目</label>
          <Select value={form.type} onValueChange={(v) => handleChange('type', v)}>
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
          <label className="text-sm">金額</label>
          <Input type="number" value={form.amount} onChange={(e) => handleChange('amount', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">相手先／クライアント</label>
          <Input value={form.client} onChange={(e) => handleChange('client', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">名称</label>
          <Input
            value={form.item}
            onChange={(e) => handleChange('item', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">備考</label>
          <Textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>完了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface EditProps {
  subscription: Subscription
  onEdit: (sub: Subscription) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function EditSubscriptionDialog({ subscription, onEdit, open = false, onOpenChange, trigger }: EditProps) {
  const [internalOpen, setInternalOpen] = useState(open)
  const [form, setForm] = useState<Subscription>(subscription)


  useEffect(() => {
    setForm(subscription)
  }, [subscription])

  useEffect(() => {
    setInternalOpen(open)
  }, [open])

  const handleChange = (key: keyof Subscription, value: any) => {
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

  return (
    <Dialog open={onOpenChange ? open : internalOpen} onOpenChange={(v) => onOpenChange ? onOpenChange(v) : setInternalOpen(v)}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>サブスク編集</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <label className="text-sm">名前</label>
          <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">カテゴリ</label>
          <Select value={form.category} onValueChange={(v) => handleChange('category', v)}>
            <SelectTrigger>
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Income" className="text-green-500">収入</SelectItem>
              <SelectItem value="Expense" className="text-red-500">支出</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">勘定科目</label>
          <Select value={form.type} onValueChange={(v) => handleChange('type', v)}>
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
          <label className="text-sm">金額</label>
          <Input type="number" value={form.amount} onChange={(e) => handleChange('amount', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">相手先／クライアント</label>
          <Input value={form.client} onChange={(e) => handleChange('client', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">名称</label>
          <Input
            value={form.item}
            onChange={(e) => handleChange('item', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">備考</label>
          <Textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
