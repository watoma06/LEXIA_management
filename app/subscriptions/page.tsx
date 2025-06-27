"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { supabase, SUBSCRIPTIONS_TABLE } from "@/lib/supabase"
import type { Subscription } from "@/lib/types"
import { AddSubscriptionDialog, EditSubscriptionDialog } from "@/components/subscription-dialogs"

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [editing, setEditing] = useState<Subscription | null>(null)

  useEffect(() => {
    supabase
      .from(SUBSCRIPTIONS_TABLE)
      .select("*")
      .then(({ data }) => setSubs(data ?? []))
      .catch(() => setSubs([]))
  }, [])

  const handleAdd = async (s: Omit<Subscription, "id">) => {
    const { data, error } = await supabase
      .from(SUBSCRIPTIONS_TABLE)
      .insert(s)
      .select()
      .single()
    if (error) {
      console.error("insert error", error.message)
      return
    }
    if (data) setSubs((prev) => [...prev, data as Subscription])
  }

  const handleEdit = async (s: Subscription) => {
    const { data } = await supabase
      .from(SUBSCRIPTIONS_TABLE)
      .update(s)
      .eq("id", s.id)
      .select()
      .single()
    if (data)
      setSubs((prev) => prev.map((v) => (v.id === s.id ? (data as Subscription) : v)))
  }

  const handleDelete = async (id: string) => {
    await supabase.from(SUBSCRIPTIONS_TABLE).delete().eq("id", id)
    setSubs((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">サブスク管理</h1>
      <AddSubscriptionDialog onAdd={handleAdd} />
      <div className="space-y-2 mt-4">
        {subs.map((s) => (
          <Card key={s.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-muted-foreground">
                {s.category === "Income" ? "収入" : "支出"} / {s.type} / ¥{s.amount}
              </div>
            </div>
            <div className="flex gap-2">
              <EditSubscriptionDialog
                subscription={s}
                onEdit={handleEdit}
                open={editing?.id === s.id}
                onOpenChange={(v) => (!v ? setEditing(null) : null)}
                trigger={<Button variant="outline" size="sm" onClick={() => setEditing(s)}>編集</Button>}
              />
              <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)}>
                削除
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
