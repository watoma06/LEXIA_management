# LEXIA management system

*[v0.dev](https://v0.dev) デプロイメントと自動同期*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/watoma06s-projects/v0-crypto-dashboard)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/Yg4kEUMeMZ8)

## 概要

LEXIA会計ダッシュボードは、収入と支出を管理するためのシンプルなウェブアプリケーションです。このプロジェクトは[v0.dev](https://v0.dev)を使用して生成され、財務記録の管理とキャッシュフローの可視化のためのスタートポイントとして機能します。

## デプロイメント

あなたのプロジェクトは以下のURLで公開されています：

**[https://vercel.com/watoma06s-projects/v0-crypto-dashboard](https://vercel.com/watoma06s-projects/v0-crypto-dashboard)**

## アプリの構築

以下のURLでアプリの構築を続けてください：

**[https://v0.dev/chat/projects/Yg4kEUMeMZ8](https://v0.dev/chat/projects/Yg4kEUMeMZ8)**

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

## CSVインポート形式

一括インポートでは、以下のヘッダー列を持つCSVファイルが必要です：

\`\`\`
category,type,date,amount,client,item,notes
\`\`\`

`category`は`Income`（収入）または`Expense`（支出）のいずれかにしてください。`type`列は勘定科目を表す任意のテキスト値を受け付けます。`date`は`YYYY-MM-DD`形式である必要があり、`amount`は数値にしてください。
