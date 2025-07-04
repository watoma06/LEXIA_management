# LEXIA management system

*[v0.dev](https://v0.dev) デプロイメントと自動同期*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/watoma06s-projects/v0-crypto-dashboard)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/Yg4kEUMeMZ8)

## 概要

LEXIA management systemは、LEXIAの業務管理を効率化するための総合的な社内向けアプリケーションです。このシステムは、プロジェクト管理、予約管理、顧客管理など、多岐にわたる業務を一元的にサポートすることを目的としています。会計ダッシュボード機能は、収入と支出を管理するためのシンプルなウェブアプリケーションとして提供され、財務記録の管理とキャッシュフローの可視化を支援します。このプロジェクトは[v0.dev](https://v0.dev)を使用して初期構築されました。

## デプロイメント

あなたのプロジェクトは以下のURLで公開されています：

- **Vercel Deployment URL:** [https://lexiamanagement-gq75sje0t-lexia-projects.vercel.app](https://lexiamanagement-gq75sje0t-lexia-projects.vercel.app)
- **Custom Domain:** [https://lexia-management.vercel.app](https://lexia-management.vercel.app)

## アプリの構築

以下のURLでアプリの構築を続けてください：

**[https://v0.dev/chat/projects/Yg4kEUMeMZ8](https://v0.dev/chat/projects/Yg4kEUMeMZ8)**

## 使用技術とセットアップ手順

### 主な技術スタック
- Supabase
- Resend (Example)
- Micro CMS (Example)
- Next.js
- TypeScript
- Tailwind CSS
- Vercel

### 環境変数の設定
このプロジェクトはSupabaseなどの外部サービスを利用しています。ローカル開発環境を構築する際には、プロジェクトルートに`.env.local`ファイルを作成し、必要な環境変数を設定してください。
`.env.example`ファイルに記載されている変数を参考に、以下の情報をSupabaseプロジェクトから取得して設定します:
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseプロジェクトのanonキー

サブスクリプション機能を利用する場合は、`NEXT_PUBLIC_SUPABASE_SUBSCRIPTIONS_TABLE`も設定してください（デフォルトは`subscriptions`）。
予約システム用には`NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE`を設定してください（デフォルトは`bookings`）。

その他のサービス（例: Resend, Micro CMS）を利用している場合は、それぞれのサービスのAPIキーや設定値を同様に`.env.local`に追加してください。

### ローカル開発環境の構築手順
1. リポジトリをクローンします:
   \`\`\`bash
   git clone <repository-url>
   cd <repository-directory>
   \`\`\`
2. 必要なパッケージをインストールします:
   \`\`\`bash
   pnpm install
   \`\`\`
3. `.env.local`ファイルを作成し、上記の「環境変数の設定」に従って設定します。
4. 開発サーバーを起動します:
   \`\`\`bash
   pnpm dev
   \`\`\`
   アプリケーションは `http://localhost:3000` で起動します。

## 動作原理

1. [v0.dev](https://v0.dev)を使用してプロジェクトを作成・修正
2. v0インターフェースからチャットをデプロイ
3. 変更内容が自動的にこのリポジトリにプッシュされる
4. Vercelがこのリポジトリから最新バージョンをデプロイする

## Supabase設定

このプロジェクトはSupabaseにレコードを保存します。`.env.example`を基に`.env.local`ファイルを作成し、`NEXT_PUBLIC_SUPABASE_URL`と`NEXT_PUBLIC_SUPABASE_ANON_KEY`の値を設定してください。
サブスク機能を利用する場合は`NEXT_PUBLIC_SUPABASE_SUBSCRIPTIONS_TABLE`も設定してください（デフォルトは`subscriptions`）。

予約システム用には`NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE`を設定してください（デフォルトは`bookings`）。

### 予約テーブルの例

\`\`\`
id uuid primary key default uuid_generate_v4()
patient_name text
phone text
email text
appointment_date date
appointment_time text
notes text
status text default 'pending'
created_at timestamp with time zone default now()
\`\`\`

`project_progress`テーブルで並び順を保持するため、`sort_order int4`カラムを追加しておく必要があります。

## チームでの貢献方法

開発への貢献を歓迎します。以下のガイドラインに従って協力してください。

### コードレビュー
- プルリクエストを作成する前に、変更箇所に対してセルフレビューを行ってください。
- プルリクエストには、変更の目的や内容を明確に記載してください。
- レビュアーは、コードの品質、可読性、テストカバレッジなどを確認します。
- 指摘事項があれば修正し、再度レビューを依頼してください。

### プルリクエストの手順
1. 最新の`main`ブランチから作業ブランチを作成します。
   \`\`\`bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   \`\`\`
2. 変更を行い、コミットします。コミットメッセージは分かりやすく記載してください。
   \`\`\`bash
   git add .
   git commit -m "feat: Implement new feature"
   \`\`\`
3. 作業ブランチをリモートリポジトリにプッシュします。
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`
4. GitHub上でプルリクエストを作成し、レビューを依頼します。
5. レビューでの指摘事項を修正し、マージされるのを待ちます。

## CSVインポート形式

一括インポートでは、以下のヘッダー列を持つCSVファイルが必要です：

\`\`\`
category,type,date,amount,client,item,notes
\`\`\`

`category`は`Income`（収入）または`Expense`（支出）のいずれかにしてください。`type`列は勘定科目を表す任意のテキスト値を受け付けます。`date`は`YYYY-MM-DD`形式である必要があり、`amount`は数値にしてください。

## ライセンス情報

このプロジェクトは MIT License のもとで公開されています。詳細については、リポジトリ内の `LICENSE` ファイルを参照してください。

(注: `LICENSE` ファイルがまだリポジトリにない場合は、MIT License の標準的なテキストを含む `LICENSE` ファイルを別途作成してください。)
