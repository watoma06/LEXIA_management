"use client"

import { useEffect, useState } from "react"
import { RecordsTable, RecordItem } from "@/components/vault-table"
import { AddRecordDialog, NewRecord } from "@/components/add-record-dialog"
import { EditRecordDialog } from "@/components/edit-record-dialog"

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [editing, setEditing] = useState<RecordItem | null>(null)

  useEffect(() => {
    fetch("/api/records")
      .then((res) => res.json())
      .then(setRecords)
      .catch(() => setRecords([]))
  }, [])

  const handleAdd = async (record: NewRecord) => {
    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    })
    const data: RecordItem = await res.json()
    setRecords((prev) => [...prev, data])
  }

  const handleUpdate = async (updated: RecordItem) => {
    const res = await fetch("/api/records", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
    const data: RecordItem = await res.json()
    setRecords((prev) => prev.map((r) => (r.id === data.id ? data : r)))
  }

  const handleDelete = async (id: number) => {
    await fetch("/api/records", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
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
