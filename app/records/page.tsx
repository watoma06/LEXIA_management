"use client"

import { useEffect, useState } from "react"
import { RecordsTable, RecordItem } from "@/components/vault-table"
import { AddRecordDialog, NewRecord } from "@/components/add-record-dialog"
import { EditRecordDialog } from "@/components/edit-record-dialog"
import { supabase, TABLE_NAME } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { toast } from "@/hooks/use-toast"

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const { session } = useAuth()
  const [editing, setEditing] = useState<RecordItem | null>(null)

  useEffect(() => {
    if (!session) return
    supabase
      .from(TABLE_NAME)
      .select("*")
      .eq('user_id', session.user.id)
      .then(({ data }) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [session])

  const handleAdd = async (record: NewRecord) => {
    if (!session) return
    const { data } = await supabase
      .from(TABLE_NAME)
      .insert({ ...record, user_id: session.user.id })
      .select()
      .single()
    if (data) {
      setRecords((prev) => [...prev, data as RecordItem])
      toast({ title: "レコードを追加しました" })
    }
  }

  const handleImport = async (records: NewRecord[]) => {
    if (!session) return
    const payload = records.map((r) => ({ ...r, user_id: session.user.id }))
    const { data } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
    if (data) {
      setRecords((prev) => [...prev, ...(data as RecordItem[])])
      toast({ title: "インポートが完了しました" })
    }
  }

  const handleUpdate = async (updated: RecordItem) => {
    if (!session) return
    const { data } = await supabase
      .from(TABLE_NAME)
      .update(updated)
      .eq("id", updated.id)
      .eq('user_id', session.user.id)
      .select()
      .single()
    if (data)
      setRecords((prev) =>
        prev.map((r) => (r.id === (data as RecordItem).id ? (data as RecordItem) : r))
      )
    if (data) toast({ title: "レコードを更新しました" })
  }

  const handleDelete = async (id: number) => {
    if (!session) return
    await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id)
      .eq('user_id', session.user.id)
    setRecords((prev) => prev.filter((r) => r.id !== id))
    toast({ title: "レコードを削除しました" })
  }

  return (
    <DashboardLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">収入と支出</h1>
        <AddRecordDialog onAdd={handleAdd} onImport={handleImport} />
      </div>
      <RecordsTable
        records={records}
        onEdit={(r) => setEditing(r)}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      {editing && (
        <EditRecordDialog
          record={editing}
          onEdit={(r) => {
            handleUpdate(r)
            setEditing(null)
          }}
          open={true}
          onOpenChange={(v) => !v && setEditing(null)}
        />
      )}
    </DashboardLayout>
  )
}
