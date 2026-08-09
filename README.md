# ダイエットタイプ診断 Webアプリ

## 概要
16タイプのダイエット性格診断アプリです。24の質問（4軸×6問）に答えることで、ユーザーに最適なダイエット方法を提案します。

## 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React
- **フォント**: Noto Sans JP
- **デプロイ**: Vercel

## 主な機能
- レスポンシブ対応（モバイルファースト）
- スムーズなページ遷移アニメーション
- 4段階スケールでの質問回答（そう思う〜そう思わない）
- 16種類の詳細な診断結果
- SNSシェア機能（Twitter, LINE, Instagram）
- SEO最適化・OGP対応
- カスタム404ページ
- Google Analytics準備

## ディレクトリ構成
```
src/
├── app/                    # App Router ページ
│   ├── layout.tsx         # ルートレイアウト（SEO設定含む）
│   ├── page.tsx           # トップページ
│   ├── not-found.tsx      # 404ページ
│   ├── quiz/[id]/         # 質問ページ
│   └── result/            # 診断結果ページ
├── components/            # 再利用可能コンポーネント
├── data/                  # データファイル
│   ├── questions.ts       # 24の質問データ
│   └── diagramTypes.ts    # 16タイプの診断データ
├── lib/                   # ユーティリティ関数
│   └── scoring.ts         # スコアリングロジック
└── types/                 # TypeScript型定義
```

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定（オプション）
```bash
cp .env.example .env.local
# Google Analytics IDを設定
```

3. 開発サーバーの起動
```bash
npm run dev
```

## デプロイ

### Vercel（推奨）
1. GitHubリポジトリにプッシュ
2. Vercelで新しいプロジェクトを作成
3. GitHubリポジトリを連携
4. 自動デプロイ

### 環境変数設定（Vercel）
- `NEXT_PUBLIC_GA_ID`: Google Analytics測定ID

## カスタマイズ

### 質問の変更
`src/data/questions.ts` を編集

### 診断タイプの変更
`src/data/diagramTypes.ts` を編集

### スコアリングロジックの変更
`src/lib/scoring.ts` を編集

### カラーテーマの変更
- メインカラー: `#4CAF50` (緑)
- サブカラー: `#2196F3` (青)
- アクセント: `#FF7043` (オレンジ)
- 背景: `#F5F9F5` (薄い緑)

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP), a Japanese font family.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## ライセンス
MIT License# Force redeploy
