"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"
import { formatNumber } from "@/lib/utils"
import { supabase, SUBSCRIPTIONS_TABLE } from "@/lib/supabase" // Supabaseとテーブル名をインポート
import { useToast } from "@/hooks/use-toast" // useToastをインポート

export type RecordItem = {
  id: number
  category: "Income" | "Expense"
  type: string
  date: string
  amount: number
  client: string
  item: string
  notes: string
}

interface RecordsTableProps {
  records: RecordItem[]
  onEdit?: (record: RecordItem) => void
  onDelete?: (id: number) => void
  onUpdate?: (record: RecordItem) => void
}

export function RecordsTable({ records, onEdit, onDelete, onUpdate }: RecordsTableProps) {
  const { toast } = useToast() // toast関数を取得
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RecordItem
    direction: "asc" | "desc"
  }>({ key: "date", direction: "desc" })

  const sortedRecords = useMemo(() => {
    if (!sortConfig) return records
    const sorted = [...records].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
    return sorted
  }, [records, sortConfig])

  const handleSort = (key: keyof RecordItem) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key)
        return { key, direction: "asc" }
      return {
        key,
        direction: prev.direction === "asc" ? "desc" : "asc",
      }
    })
  }
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

  const handleAddToSubscription = async (record: RecordItem) => {
    // RecordItem を Subscription 型に変換 (id は自動生成されるので不要)
    // name は record.item を使用。必要に応じてユーザー入力に変更することも検討。
    const subscriptionData = {
      name: record.item || `サブスク-${new Date().toISOString()}`, // itemがない場合はデフォルト名を付与
      category: record.category,
      type: record.type,
      amount: record.amount,
      client: record.client,
      item: record.item,
      notes: record.notes,
    }

    const { data, error } = await supabase
      .from(SUBSCRIPTIONS_TABLE)
      .insert(subscriptionData)
      .select()
      .single()

    if (error) {
      console.error("Subscription insert error:", error.message)
      toast({
        title: "エラー",
        description: "サブスクリプションの追加に失敗しました。",
        variant: "destructive",
      })
    } else if (data) {
      toast({
        title: "成功",
        description: `「${data.name}」をサブスクリプションに追加しました。`,
      })
      // ここでサブスクリプションリストを更新する処理を呼び出すか、
      // app/subscriptions/page.tsx 側で変更を検知して再取得する形になります。
      // 今回は通知のみとし、サブスク管理ページを開いた際に最新情報が読み込まれる想定とします。
    }
  }

  return (
    <>
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
          <TableHead onClick={() => handleSort("category")}
            className="cursor-pointer select-none">
            カテゴリ
            {sortConfig?.key === "category" && (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="inline h-3 w-3" />
              ) : (
                <ChevronDown className="inline h-3 w-3" />
              )
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("type")}
            className="cursor-pointer select-none">
            勘定科目
            {sortConfig?.key === "type" && (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="inline h-3 w-3" />
              ) : (
                <ChevronDown className="inline h-3 w-3" />
              )
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("date")}
            className="cursor-pointer select-none">
            日付
            {sortConfig?.key === "date" && (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="inline h-3 w-3" />
              ) : (
                <ChevronDown className="inline h-3 w-3" />
              )
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("amount")}
            className="cursor-pointer select-none">
            金額
            {sortConfig?.key === "amount" && (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="inline h-3 w-3" />
              ) : (
                <ChevronDown className="inline h-3 w-3" />
              )
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("client")}
            className="cursor-pointer select-none">
            相手先／クライアント
            {sortConfig?.key === "client" && (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="inline h-3 w-3" />
              ) : (
                <ChevronDown className="inline h-3 w-3" />
              )
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("item")}
            className="cursor-pointer select-none">
            名称
            {sortConfig?.key === "item" && (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="inline h-3 w-3" />
              ) : (
                <ChevronDown className="inline h-3 w-3" />
              )
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("notes")}
            className="cursor-pointer select-none">
            備考
            {sortConfig?.key === "notes" && (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="inline h-3 w-3" />
              ) : (
                <ChevronDown className="inline h-3 w-3" />
              )
            )}
          </TableHead>
          <TableHead className="w-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRecords.map((record) => (
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
              <span
                className={
                  record.category === "Income" ? "text-green-500" : "text-red-500"
                }
              >
                {record.category === "Income" ? "収入" : "支出"}
              </span>
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
              className={
                record.category === "Expense" || record.category === "支出"
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {formatNumber(record.amount)}
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
                handleBlur(record.id, "notes", e.currentTarget.textContent || "")
              }
            >
              {record.notes}
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
                  <DropdownMenuItem onClick={() => handleAddToSubscription(record)}>
                    サブスク追加
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
      </div>
      <div className="space-y-4 sm:hidden">
        {sortedRecords.map((record) => (
          <Card key={record.id} className="p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">カテゴリ</span>
              <span
                className={
                  record.category === "Income" ? "text-green-500" : "text-red-500"
                }
              >
                {record.category === "Income" ? "収入" : "支出"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">勘定科目</span>
              <span>{record.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">日付</span>
              <span>{record.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">金額</span>
              <span
                className={
                  record.category === "Expense" || record.category === "支出"
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {formatNumber(record.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">相手先／クライアント</span>
              <span>{record.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">名称</span>
              <span>{record.item}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">備考</span>
              <span>{record.notes}</span>
            </div>
            <div className="text-right">
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
                  <DropdownMenuItem onClick={() => handleAddToSubscription(record)}>
                    サブスク追加
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(record.id)}
                    className="text-destructive"
                  >
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
