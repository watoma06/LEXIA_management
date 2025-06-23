"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  BarChart3,
  ChevronDown,
  Globe,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Settings,
  Wallet,
} from "lucide-react"

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Wallet className="h-6 w-6" />
          <span className="font-bold">LEXIA Finance</span>
        </div>
        <div className="px-4 py-4">
          <Input placeholder="Search" className="bg-background/50" />
        </div>
        <nav className="space-y-2 px-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <BarChart3 className="h-4 w-4" />
            Income & Expenses
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Globe className="h-4 w-4" />
            Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Home className="h-4 w-4" />
            Budget
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Wallet className="h-4 w-4" />
            Accounts
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LifeBuoy className="h-4 w-4" />
            Support
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
