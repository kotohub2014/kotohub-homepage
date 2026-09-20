/**
 * 全ページを静的な HTML に書き出す (プリレンダー)。
 *
 *   npm run build の最後に走る。手で回すなら:
 *   vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
 *
 * やること:
 *   1. dist-ssr/entry-server.js (SSR 用にビルドした App) を読む
 *   2. PageMeta の META にあるルートを 1 つずつ描く (lazy なページも待ってから)
 *   3. dist/index.html を雛形に、本文・title・description・canonical を差し替えて
 *      dist/<route>/index.html に置く ("/" は dist/index.html を置き換える)
 *
 * Vercel は実ファイルを rewrites より先に見るので、/services は dist/services/index.html が
 * 返る。どれにも当たらない URL だけが今までどおり /index.html へ落ちる。
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { Writable } from 'node:stream';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderToPipeableStream } from 'react-dom/server';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://www.kotohub.info';

const { createApp, META } = await import(pathToFileURL(join(ROOT, 'dist-ssr', 'entry-server.js')).href);

/** lazy() のページが解決するまで待ってから、まとめて文字列にする */
function render(url) {
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _enc, done) {
        html += chunk.toString();
        done();
      },
      final(done) {
        resolve(html);
        done();
      },
    });
    const { pipe } = renderToPipeableStream(createApp(url), {
      onAllReady() {
        pipe(sink);
      },
      onShellError: reject,
      onError(error) {
        console.error(`[prerender] ${url}:`, error);
      },
    });
  });
}

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** JS が動かない閲覧者にも見えるように。アニメーションの初期値 (opacity:0) を打ち消す */
const NOSCRIPT = '<noscript><style>[style*="opacity"]{opacity:1!important;transform:none!important}</style></noscript>';

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('dist/index.html に <div id="root"></div> が見つかりません');

let total = 0;
for (const [route, meta] of Object.entries(META)) {
  const body = await render(route);
  const url = `${ORIGIN}${route === '/' ? '/' : route}`;
  const page = template
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace('</head>', `${NOSCRIPT}</head>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(meta.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttr(meta.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);

  const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const out = route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
  total += text.length;
  console.log(`[prerender] ${route.padEnd(12)} 本文 ${String(text.length).padStart(6)} 字 → ${out.slice(ROOT.length + 1)}`);
  if (text.length < 200) throw new Error(`${route} の本文が ${text.length} 字しかありません。描画に失敗しています`);
}
console.log(`[prerender] ${Object.keys(META).length} ページ、本文 合計 ${total} 字`);

// SSR 用の束は配らない
rmSync(join(ROOT, 'dist-ssr'), { recursive: true, force: true });
