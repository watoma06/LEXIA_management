"use client"

import { Button } from "@/components/ui/button"
import LogoutButton from "@/components/LogoutButton"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  BookOpen,
  CalendarClock,
  Menu,
  Settings,
  Wallet,
  Calculator,
  ListTodo,
} from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()
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
          <span className="font-bold">LEXIA management system</span>
        </div>
        <nav className="space-y-2 px-2">
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/">
              <LayoutDashboard className="h-4 w-4" />
              ダッシュボード
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/calculator">
              <Calculator className="h-4 w-4" />
              電卓
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/kgi-kpi">
              <BarChart3 className="h-4 w-4" />
              KGI/KPI
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/todo">
              <ListTodo className="h-4 w-4" />
              Todo
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/web-dev">
              <BookOpen className="h-4 w-4" />
              WEB開発手法
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/reservation">
              <CalendarClock className="h-4 w-4" />
              予約画面
            </Link>
          </Button>
          {pathname?.startsWith("/reservation") && (
            <Button asChild variant="ghost" className="w-full justify-start gap-2">
              <Link href="/reservation/admin">
                <LayoutDashboard className="h-4 w-4" />
                管理画面
              </Link>
            </Button>
          )}
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
