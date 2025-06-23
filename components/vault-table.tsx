"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export type RecordItem = {
  id: number
  category: "Income" | "Expense"
  type: "維持費" | "制作費" | "その他"
  date: string
  amount: number
  client: string
  item: string
  note: string
}

interface RecordsTableProps {
  records: RecordItem[]
  onEdit?: (record: RecordItem) => void
  onDelete?: (id: number) => void
  onUpdate?: (record: RecordItem) => void
}

export function RecordsTable({ records, onEdit, onDelete, onUpdate }: RecordsTableProps) {
  const handleBlur = (
    id: number,
    key: keyof RecordItem,
    value: string
  ) => {
    const record = records.find((r) => r.id === id)
    if (!record) return
    let newValue: any = value.trim()
    if (key === "amount") {
      newValue = Number(newValue.replace(/,/g, ""))
    }
    if (key === "category") {
      newValue = newValue === "収入" ? "Income" : newValue === "支出" ? "Expense" : newValue
    }
    const updated = { ...record, [key]: newValue } as RecordItem
    onUpdate?.(updated)
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>カテゴリ</TableHead>
          <TableHead>勘定科目</TableHead>
          <TableHead>日付</TableHead>
          <TableHead>金額</TableHead>
          <TableHead>相手先／クライアント</TableHead>
          <TableHead>品目</TableHead>
          <TableHead>備考</TableHead>
          <TableHead className="w-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleBlur(
                  record.id,
                  "category",
                  e.currentTarget.textContent || ""
                )
              }
            >
              {record.category === "Income" ? "収入" : "支出"}
            </TableCell>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleBlur(record.id, "type", e.currentTarget.textContent || "")
              }
            >
              {record.type}
            </TableCell>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleBlur(record.id, "date", e.currentTarget.textContent || "")
              }
            >
              {record.date}
            </TableCell>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleBlur(record.id, "amount", e.currentTarget.textContent || "")
              }
            >
              {record.amount.toLocaleString()}
            </TableCell>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleBlur(record.id, "client", e.currentTarget.textContent || "")
              }
            >
              {record.client}
            </TableCell>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleBlur(record.id, "item", e.currentTarget.textContent || "")
              }
            >
              {record.item}
            </TableCell>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleBlur(record.id, "note", e.currentTarget.textContent || "")
              }
            >
              {record.note}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(record)}>
                    編集
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete?.(record.id)} className="text-destructive">
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
