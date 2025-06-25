"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import LogoutButton from "@/components/LogoutButton"
import {
  BarChart3,
  ChevronDown,
  Globe,
  Home,
  Package,
  LayoutDashboard,
  PanelLeft,
  Settings,
  Wallet,
} from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
        <span className="font-bold">LEXIA会計システム</span>
      </header>
      <div
        className="grid transition-[grid-template-columns] duration-200"
        style={{ gridTemplateColumns: sidebarOpen ? "280px 1fr" : "1fr" }}
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
                収入と支出
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start gap-2">
              <Link href="/reports">
                <Globe className="h-4 w-4" />
                レポート
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
            <div className="px-2 mt-2">
              <LogoutButton />
            </div>
          </nav>
        </aside>
        )}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
