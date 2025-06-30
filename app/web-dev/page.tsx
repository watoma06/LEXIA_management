"use client"

import DashboardLayout from "@/components/dashboard-layout"
import {
  Code,
  Bot,
  Github,
  Server,
  Database,
  Mail,
  BookOpenText,
  Globe
} from "lucide-react"

export default function WebDevPage() {
  const methods = [
    {
      icon: Code,
      title: "バイブコーディング",
      desc: "人とAIが同時にコードを整える作業スタイル",
    },
    {
      icon: Bot,
      title: "メインAI Codex",
      desc: "代表・齋藤の方針でプロジェクトを先導",
    },
    {
      icon: Bot,
      title: "サブAI Jules / Copilot",
      desc: "Codexを補佐し作業効率をアップ",
    },
    {
      icon: Github,
      title: "Githubで共有・レビュー",
      desc: "メンバー間のコードを一元管理",
    },
    {
      icon: Server,
      title: "Vercelでデプロイ・環境変数管理",
      desc: "本番環境への反映とAPIキーを集中管理",
    },
    {
      icon: Database,
      title: "Supabase",
      desc: "バックエンドとDBを担当",
    },
    {
      icon: Mail,
      title: "Resend",
      desc: "お問い合わせフォームを簡単設置",
    },
    {
      icon: BookOpenText,
      title: "Micro CMS",
      desc: "ブログ記事をヘッドレスCMSで管理",
    },
  ]

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">LEXIAのWEB開発手法</h1>
      <div className="grid gap-4">
        {methods.map((m) => (
          <div key={m.title} className="flex gap-3 items-start">
            <m.icon className="h-6 w-6 text-primary" />
            <div>
              <div className="font-semibold">{m.title}</div>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
