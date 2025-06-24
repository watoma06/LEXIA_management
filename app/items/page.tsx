"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase, ITEMS_TABLE } from "@/lib/supabase"

interface Item {
  id: number
  name: string
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState("")

  useEffect(() => {
    supabase
      .from(ITEMS_TABLE)
      .select("*")
      .then(({ data }) => setItems(data ?? []))
      .catch(() => setItems([]))
  }, [])

  const handleAdd = async () => {
    if (!name.trim()) return
    const { data } = await supabase
      .from(ITEMS_TABLE)
      .insert({ name })
      .select()
      .single()
    if (data) setItems((prev) => [...prev, data as Item])
    setName("")
  }

  const handleDelete = async (id: number) => {
    await supabase.from(ITEMS_TABLE).delete().eq("id", id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">品目管理</h1>
      <div className="flex gap-2 mb-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="品目名" />
        <Button onClick={handleAdd}>追加</Button>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between border p-2 rounded">
            <span>{item.name}</span>
            <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
              削除
            </Button>
          </li>
        ))}
      </ul>
    </DashboardLayout>
  )
}
