import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
}

export function RecordsTable({ records }: RecordsTableProps) {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
