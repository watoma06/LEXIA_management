"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CalculatorPage() {
  const [value, setValue] = useState("")

  const handleClick = (char: string) => {
    if (char === "C") {
      setValue("")
    } else if (char === "=") {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(value)
        setValue(String(result))
      } catch {
        setValue("Error")
      }
    } else {
      setValue((prev) => prev + char)
    }
  }

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
    "C",
  ]

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">電卓</h1>
      <Card className="p-4 max-w-xs space-y-2">
        <div className="border rounded p-2 text-right h-10">{value || "0"}</div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((b) => (
            <Button key={b} variant="outline" onClick={() => handleClick(b)}>
              {b}
            </Button>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}
