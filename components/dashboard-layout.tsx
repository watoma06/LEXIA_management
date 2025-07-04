"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import LogoutButton from "@/components/LogoutButton"
import {
  BarChart3,
  ChevronDown,
  Globe,
  BookOpen,
  CalendarClock,
  Home,
  Package,
  LayoutDashboard,
  PanelLeft,
  Settings,
  Wallet,
  Calculator,
  ListTodo,
} from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="absolute left-6 top-6 z-20 hidden lg:inline-flex"
        >
          <PanelLeft className="h-6 w-6" />
          <span className="sr-only">Open Sidebar</span>
        </Button>
      )}
      <header className="flex items-center h-16 gap-2 border-b px-4 lg:hidden">
        <MobileNav />
        <Wallet className="h-6 w-6" />
        <span className="font-bold">LEXIA management system</span>
      </header>
      <div
        className={`grid transition-[grid-template-columns] duration-200 [grid-template-columns:1fr] ${
          sidebarOpen
            ? "lg:[grid-template-columns:280px_1fr]"
            : "lg:[grid-template-columns:1fr]"
        }`}
      >
        {sidebarOpen && (
        <aside className="hidden border-r bg-background/50 backdrop-blur lg:block">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="hidden lg:inline-flex mr-2"
            >
              <PanelLeft className="h-4 w-4" />
              <span className="sr-only">Close Sidebar</span>
            </Button>
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
              <Link href="/subscriptions">
                <Package className="h-4 w-4" />
                サブスク管理
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
              <Link href="/web-dev">
                <BookOpen className="h-4 w-4" />
                WEB開発手法
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start gap-2">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                設定
              </Link>
            </Button>
            <div className="px-2 mt-2">
              <LogoutButton />
            </div>
          </nav>
        </aside>
        )}
        <main className="p-6 min-w-0">{children}</main>
      </div>
    </div>
  )
}
