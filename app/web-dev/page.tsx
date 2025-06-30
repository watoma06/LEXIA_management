"use client"

import { Users, Bot, Sparkles, Github, Cloud, Database, Mail, FileText, Code2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

const steps = [
  { icon: Users, text: "バイブコーディングを主として行う" },
  { icon: Bot, text: "メインAIエージェントはCodex" },
  { icon: Sparkles, text: "サブAIエージェントはGoogle Jules、Github Copilot" },
  { icon: Github, text: "チームでのコードの共有とレビューはGithub" },
  { icon: Cloud, text: "デプロイと環境変数（API）はVercelで管理" },
  { icon: Database, text: "バックエンドはSupabaseを使用" },
  { icon: Mail, text: "お問い合わせフォームの設置はResendを使用" },
  { icon: FileText, text: "ブログ関連はヘッドレスCMSのMicro CMSを使用" },
]

export default function WebDevPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">LEXIAのWEB開発手法</h1>
      <ul className="space-y-3">
        {steps.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-2">
            <Icon className="h-5 w-5 mt-1 text-primary" />
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </DashboardLayout>
  )
}
