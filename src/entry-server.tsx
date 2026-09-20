import { StaticRouter } from 'react-router-dom/server';
import App from './App';

/**
 * プリレンダー用の入口。**ビルド時に各ページを静的な HTML へ書き出すためだけに使う。**
 *
 * このサイトは SPA なので、配っている HTML は `<div id="root"></div>` だけだった。
 * JS を動かさないクローラ (AdSense の審査など) には本文が 1 字も見えず、
 * 「有用性の低いコンテンツ」と判定された。ビルドの最後に scripts/prerender.mjs が
 * ここから各ルートを描き、dist/<route>/index.html に本文入りで置く。
 *
 * ブラウザ側は今までどおり main.tsx (createRoot) が描き直すので、動きは変わらない。
 */
export { META } from './components/PageMeta';

export function createApp(url: string) {
  return (
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
