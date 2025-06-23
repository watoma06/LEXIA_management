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
}

export function RecordsTable({ records, onEdit, onDelete }: RecordsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>カテゴリ</TableHead>
          <TableHead>タイプ</TableHead>
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
            <TableCell>{record.category === "Income" ? "収入" : "支出"}</TableCell>
            <TableCell>{record.type}</TableCell>
            <TableCell>{record.date}</TableCell>
            <TableCell>{record.amount.toLocaleString()}</TableCell>
            <TableCell>{record.client}</TableCell>
            <TableCell>{record.item}</TableCell>
            <TableCell>{record.note}</TableCell>
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
