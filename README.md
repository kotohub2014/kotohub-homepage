# KotoHub — コーポレートサイト

個人事業主「KotoHub」のホームページ。黒 × ゴールドを基調に、スクロール／ページ遷移アニメーションを備えたリッチなSPAです。

- **Stack**: React 18 + Vite 5 + TypeScript 5 + React Router 6 + Framer Motion
- **Deploy**: Vercel（ドメイン: `kotohub.info`）

---

## セットアップ

```bash
npm install
```

```bash
npm run dev
```

http://localhost:5173 で起動します。

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` | 型チェック + 本番ビルド（`dist/`） |
| `npm run preview` | ビルド結果のローカル確認 |
| `npm run typecheck` | 型チェックのみ |

---

## ディレクトリ構成

```
src/
├─ main.tsx              エントリ（BrowserRouter）
├─ App.tsx               ルーティング + ページ遷移アニメーション
├─ index.css             スタイルの読み込み口
├─ data/
│  └─ content.ts         ★ 全ページの文言・価格・事業者情報
├─ components/
│  ├─ Ambient.tsx        背景（粒子キャンバス / グリッド / 光のオーブ）
│  ├─ Nav.tsx            固定ヘッダー + モバイルドロワー
│  ├─ Footer.tsx
│  ├─ Logo.tsx
│  ├─ Icons.tsx          サービスアイコン（SVG）
│  ├─ Reveal.tsx         スクロール表示アニメーション
│  ├─ SpotlightCard.tsx  カーソル追従スポットライトのカード
│  ├─ Counter.tsx        数値カウントアップ
│  ├─ Faq.tsx            アコーディオン
│  ├─ PageHead.tsx       下層ページ共通ヘッダー
│  ├─ PageMeta.tsx       ルートごとの title / description / canonical
│  ├─ ScrollToTop.tsx    遷移時のスクロール制御（#ハッシュ対応）
│  └─ CTA.tsx            共通クロージング導線
├─ pages/                Home / Services / Products / Strengths / About / Contact / Privacy / NotFound
└─ styles/
   ├─ base.css           デザイントークン（色・タイポ・余白）
   ├─ components.css     ナビ・ボタン・カード・フッター等
   └─ pages.css          各ページ固有のレイアウト
```

---

## ルーティング

タブ切り替えは URL と 1:1 で対応しています（React Router の `BrowserRouter`）。

| パス | ページ |
| --- | --- |
| `/` | トップ |
| `/services` | 事業内容（`#catalog` `#app` `#web` `#cloud` `#data` `#ai` でアンカー遷移可） |
| `/products` | プロダクトカタログ（サブスク） |
| `/strengths` | 強み・開発フロー・技術スタック |
| `/about` | 事業者情報・FAQ |
| `/contact` | お問い合わせ |
| `/privacy` | プライバシーポリシー |
| その他 | 404 |

SPA のため直リンク時に 404 とならないよう、`vercel.json` で全パスを `index.html` にリライトしています。

---

## 公開までの手順（Vercel）

1. リポジトリを GitHub に push
2. Vercel で **Add New → Project** からインポート
3. Framework Preset は `Vite`（`vercel.json` により自動設定されます）
4. Deploy 後、**Settings → Domains** で `kotohub.info` を追加し、DNS を設定

環境変数を使う場合は **Settings → Environment Variables** に `VITE_CONTACT_ENDPOINT` を追加してください（下記参照）。

---

## お問い合わせフォームについて

現状はフロントエンドのみのため、送信手段が2通りあります。

| 状態 | 挙動 |
| --- | --- |
| `VITE_CONTACT_ENDPOINT` **未設定** | 入力内容を本文に差し込んでメーラーを起動（フォールバック） |
| `VITE_CONTACT_ENDPOINT` **設定済み** | そのURLへ JSON を POST |

本番では Formspree / Resend / Vercel Functions などのエンドポイントを設定することを推奨します。

```bash
# .env.local
VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

---

## ⚠️ 公開前に差し替えが必要な項目

`src/data/content.ts` の `PLACEHOLDER` コメントが付いた箇所は仮の値です。

- **事業者情報** (`businessInfo`) — 代表者名、所在地、開業年月、インボイス登録番号
- **代表者名・所在地・開業年月・インボイス登録番号** — `businessInfo` 内のプレースホルダーを差し替え
- **プロダクト** (`products`) — 名称・説明・**価格はすべてサンプル**です。実際に提供するプロダクトに差し替えてください
- **料金プラン** (`src/pages/Services.tsx` の Pricing セクション) — 金額はサンプルです
- **数値実績** (`stats`) — 「開発工数60%削減」等は目安値です。実績に基づく数値へ
- **プライバシーポリシー制定日** (`src/pages/Privacy.tsx`)
- **OGP画像** — `public/ogp.png`（1200×630）を配置してください。未配置の場合SNSシェア時に画像が表示されません

---

## デザインの調整ポイント

色・フォント・余白は `src/styles/base.css` の `:root` に集約しています。

```css
--gold: #d4af37;        /* 基調のゴールド */
--gold-light: #f7e08c;  /* ハイライト */
--bg: #05050a;          /* ベースの黒 */
--max: 1240px;          /* コンテンツ最大幅 */
```

アニメーションは `prefers-reduced-motion: reduce` を尊重し、OS設定で「視差効果を減らす」が有効な場合は自動的に抑制されます。
