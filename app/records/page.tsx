"use client"

import { useEffect, useState } from "react"
import { RecordsTable, RecordItem } from "@/components/vault-table"
import { AddRecordDialog, NewRecord } from "@/components/add-record-dialog"
import { EditRecordDialog } from "@/components/edit-record-dialog"
import { supabase } from "@/lib/supabase"

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [editing, setEditing] = useState<RecordItem | null>(null)

  useEffect(() => {
    supabase
      .from("records")
      .select("*")
      .then(({ data }) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [])

  const handleAdd = async (record: NewRecord) => {
    const { data } = await supabase
      .from("records")
      .insert(record)
      .select()
      .single()
    if (data) setRecords((prev) => [...prev, data as RecordItem])
  }

  const handleUpdate = async (updated: RecordItem) => {
    const { data } = await supabase
      .from("records")
      .update(updated)
      .eq("id", updated.id)
      .select()
      .single()
    if (data)
      setRecords((prev) =>
        prev.map((r) => (r.id === (data as RecordItem).id ? (data as RecordItem) : r))
      )
  }

  const handleDelete = async (id: number) => {
    await supabase.from("records").delete().eq("id", id)
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">収入と支出</h1>
        <AddRecordDialog onAdd={handleAdd} />
      </div>
      <RecordsTable
        records={records}
        onEdit={(r) => setEditing(r)}
        onDelete={handleDelete}
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
    </div>
  )
}
