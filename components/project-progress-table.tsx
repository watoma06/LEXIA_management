"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal } from "lucide-react"
import { formatNumber } from "@/lib/utils"

export type ProjectProgressRecord = {
  id: string
  project_name: string
  client_name: string
  status: string
  due_date: string
  unit_price: number
}

interface ProjectProgressTableProps {
  projects: ProjectProgressRecord[]
  onEdit?: (project: ProjectProgressRecord) => void
  onDelete?: (id: string) => void
  onUpdate?: (project: ProjectProgressRecord) => void
}

export function ProjectProgressTable({ projects, onEdit, onDelete, onUpdate }: ProjectProgressTableProps) {
  const statusMap: Record<string, number> = {
    "制作待ち": 0,
    "進行中": 50,
    "完了": 100,
  }

  const handleBlur = (id: string, key: keyof ProjectProgressRecord, value: string) => {
    const project = projects.find((p) => p.id === id)
    if (!project) return
    let newValue: any = value.trim()
    if (key === "unit_price") {
      newValue = Number(newValue.replace(/,/g, ""))
    }
    const updated = { ...project, [key]: newValue } as ProjectProgressRecord
    onUpdate?.(updated)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>案件名</TableHead>
          <TableHead>顧客名</TableHead>
          <TableHead>進捗</TableHead>
          <TableHead>納期</TableHead>
          <TableHead className="text-right">制作単価</TableHead>
          <TableHead className="w-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((p) => (
          <TableRow key={p.id}>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(p.id, "project_name", e.currentTarget.textContent || "")}
            >
              {p.project_name}
            </TableCell>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(p.id, "client_name", e.currentTarget.textContent || "")}
            >
              {p.client_name}
            </TableCell>
            <TableCell className="w-40">
              <Select
                value={p.status}
                onValueChange={(v) => handleBlur(p.id, "status", v)}
              >
                <SelectTrigger className="h-2 w-full border-none p-0 [&>svg]:hidden focus:ring-0">
                  <SelectValue asChild>
                    <Progress value={statusMap[p.status] ?? 0} className="h-2 w-full" />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="制作待ち">制作待ち</SelectItem>
                  <SelectItem value="進行中">進行中</SelectItem>
                  <SelectItem value="完了">完了</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(p.id, "due_date", e.currentTarget.textContent || "")}
            >
              {p.due_date}
            </TableCell>
            <TableCell
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(p.id, "unit_price", e.currentTarget.textContent || "")}
              className="text-right"
            >
              ¥{formatNumber(p.unit_price)}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(p)}>編集</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete?.(p.id)} className="text-destructive">
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
