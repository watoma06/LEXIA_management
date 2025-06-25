"use client"

import { Button } from "@/components/ui/button"
import LogoutButton from "@/components/LogoutButton"
import Link from "next/link"
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
  Package,
  LayoutDashboard,
  Menu,
  Settings,
  Wallet,
  Calculator,
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
          <span className="font-bold">LEXIA会計システム</span>
        </div>
        <nav className="space-y-2 px-2">
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/">
              <LayoutDashboard className="h-4 w-4" />
              ダッシュボード
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/records">
              <BarChart3 className="h-4 w-4" />
              <span className="text-green-500">収入</span>
              と
              <span className="text-red-500">支出</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/reports">
              <Globe className="h-4 w-4" />
              レポート
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/calculator">
              <Calculator className="h-4 w-4" />
              電卓
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Home className="h-4 w-4" />
            予算
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Wallet className="h-4 w-4" />
            アカウント
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              設定
            </Link>
          </Button>
          <LogoutButton />
        </nav>
      </SheetContent>
    </Sheet>
  )
}
