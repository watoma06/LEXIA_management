# LEXIA会計システム

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/watoma06s-projects/v0-crypto-dashboard)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/Yg4kEUMeMZ8)

## Overview

LEXIA Finance Dashboard is a simple web application for tracking income and expenses. The project was generated using [v0.dev](https://v0.dev) and serves as a starting point for managing financial records and visualising cash flow.

## Deployment

Your project is live at:

**[https://vercel.com/watoma06s-projects/v0-crypto-dashboard](https://vercel.com/watoma06s-projects/v0-crypto-dashboard)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/Yg4kEUMeMZ8](https://v0.dev/chat/projects/Yg4kEUMeMZ8)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Supabase Configuration

This project now stores records in Supabase. Create a `.env.local` file based on
`.env.example` and provide your `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` values.

## CSV Import Format

Bulk import expects a CSV file with the following header columns:

\`\`\`
category,type,date,amount,client,item,item_id,notes
\`\`\`

`category` should be either `Income` or `Expense`. The `type` column accepts any text value representing the account title. `date` must be in `YYYY-MM-DD` format and `amount` should be a number. `item_id` corresponds to the ID from the `items` table.
