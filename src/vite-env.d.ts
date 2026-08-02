/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** お問い合わせフォームの送信先エンドポイント（Formspree / 自前API など） */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
