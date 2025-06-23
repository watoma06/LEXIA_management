import { Avatar } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"

const records = [
  {
    category: "Sales",
    symbol: "SAL",
    amount: "$13,643.21",
    today: "+$213.8",
    total: "$13,954.04",
    change: "+8.5%",
    type: "Income",
    date: "05.10.2023",
    priority: "high",
  },
  {
    category: "Office Supplies",
    symbol: "OFF",
    amount: "$1,200.00",
    today: "-$45.1",
    total: "$3,954.04",
    change: "-5.4%",
    type: "Expense",
    date: "12.03.2023",
    priority: "medium",
  },
  {
    category: "Consulting",
    symbol: "CON",
    amount: "$2,123.87",
    today: "+$13.5",
    total: "$3,954.04",
    change: "+4.1%",
    type: "Income",
    date: "21.01.2023",
    priority: "low",
  },
]

export function RecordsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>カテゴリ</TableHead>
          <TableHead>本日</TableHead>
          <TableHead>金額 ↓</TableHead>
          <TableHead>変動 ↓</TableHead>
          <TableHead>タイプ</TableHead>
          <TableHead>日付</TableHead>
          <TableHead>優先度</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.symbol}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <img src={`/placeholder.svg?height=24&width=24`} alt={record.category} />
                </Avatar>
                <div>
                  <div className="font-medium">{record.category}</div>
                  <div className="text-xs text-muted-foreground">{record.amount}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-green-500">{record.today}</TableCell>
            <TableCell>{record.total}</TableCell>
            <TableCell>{record.change}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                  record.type === "Income" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                }`}
              >
                {record.type === "Income" ? "収入" : "支出"}
              </span>
            </TableCell>
            <TableCell>{record.date}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-3 rounded-full ${
                      i < (record.priority === "high" ? 3 : record.priority === "medium" ? 2 : 1)
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
