import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { RecordsTable } from "@/components/vault-table"
import { MobileNav } from "@/components/mobile-nav"
import {
  BarChart3,
  ChevronDown,
  Globe,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Wallet,
} from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center h-16 gap-2 border-b px-4 lg:hidden">
        <MobileNav />
        <Wallet className="h-6 w-6" />
        <span className="font-bold">LEXIA Finance</span>
      </header>
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-background/50 backdrop-blur lg:block">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Wallet className="h-6 w-6" />
            <span className="font-bold">LEXIAファイナンス</span>
          </div>
          <div className="px-4 py-4">
            <Input placeholder="検索" className="bg-background/50" />
          </div>
          <nav className="space-y-2 px-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              ダッシュボード
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              収入と支出
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Globe className="h-4 w-4" />
              レポート
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
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LifeBuoy className="h-4 w-4" />
              サポート
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              設定
            </Button>
          </nav>
        </aside>
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">財務概要</h1>
              <div className="text-sm text-muted-foreground">2023年8月13日 - 2023年8月18日</div>
            </div>
            <Button variant="outline" className="gap-2">
              会計期間
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="総収入"
              value="$74,892"
              change={{ value: "$1,340", percentage: "+2.1%", isPositive: true }}
            />
            <MetricsCard
              title="総支出"
              value="$54,892"
              change={{ value: "$1,340", percentage: "-1.3%", isPositive: false }}
            />
            <MetricsCard
              title="純利益"
              value="$20,000"
              change={{ value: "$1,340", percentage: "+1.2%", isPositive: true }}
            />
          </div>
          <Card className="mt-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">キャッシュフロー</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  今日
                </Button>
                <Button size="sm" variant="ghost">
                  先週
                </Button>
                <Button size="sm" variant="ghost">
                  先月
                </Button>
                <Button size="sm" variant="ghost">
                  過去6か月
                </Button>
                <Button size="sm" variant="ghost">
                  今年
                </Button>
              </div>
            </div>
            <StatsChart />
          </Card>
          <div className="mt-6">
            <RecordsTable />
          </div>
        </main>
      </div>
    </div>
  )
}
