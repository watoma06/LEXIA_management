"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
          <span className="font-bold">LEXIAファイナンス</span>
        </div>
        <div className="px-4 py-4">
          <Input placeholder="検索" className="bg-background/50" />
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
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/items">
              <Package className="h-4 w-4" />
              名称
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
        </nav>
      </SheetContent>
    </Sheet>
  )
}
