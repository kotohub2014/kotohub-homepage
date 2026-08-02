import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { brand, faqs, navItems } from '../data/content';

type Meta = { title: string; description: string };

const META: Record<string, Meta> = {
  '/': {
    title: `${brand.name}｜中小企業のDX・AI導入パートナー｜${brand.catch}`,
    description:
      '介護シフトのAI自動作成、紙の日報のAI-OCR化、社内ナレッジ検索AIなど、中小企業のDX・AI導入を実装まで伴走。AI駆動開発とフルスタック設計で開発コストを抑えます。相談・見積り無料、全国オンライン対応。',
  },
  '/services': {
    title: `事業内容｜DX支援・AI導入・システム開発｜${brand.name}`,
    description:
      'プロダクトのサブスク提供、オリジナルアプリ開発、ホームページ制作、クラウド移行、データ分析、AI導入。中小企業のDXに必要な6つのサービスを、一つの窓口でご提供します。',
  },
  '/products': {
    title: `プロダクト｜月額で使えるAI・業務改善ツール｜${brand.name}`,
    description:
      'KotoHubが保有するプロダクトを月額サブスクリプションで貸し出します。初期開発費を抑えて、社内AIチャット・BIダッシュボード・業務自動化をすぐに導入できます。',
  },
  '/strengths': {
    title: `強み｜AI駆動開発 × フルスタック設計｜${brand.name}`,
    description:
      'AI駆動開発による高速開発 × フルスタックエンジニアの安定した技術設計 = 開発コストの削減。KotoHubが提供できる価値と、ご相談から運用までの進め方をご紹介します。',
  },
  '/about': {
    title: `事業者情報・よくあるご質問｜${brand.name}`,
    description:
      'KotoHubの屋号・事業内容・対応エリア・お取引の考え方と、費用や進め方についてよくいただくご質問への回答をまとめています。',
  },
  '/founder': {
    title: `代表紹介｜三好 智｜${brand.name}`,
    description:
      'KotoHub代表・三好智のプロフィールと、これまでの経歴をご紹介します。ご相談から開発まで、代表本人が直接担当します。',
  },
  '/contact': {
    title: `お問い合わせ｜相談・見積り無料｜${brand.name}`,
    description:
      'ご相談・お見積りは無料です。DX、AI導入、システム開発について、何から始めるべきか分からない段階でもお気軽にご相談ください。全国オンライン対応。',
  },
  '/privacy': {
    title: `プライバシーポリシー｜${brand.name}`,
    description: 'KotoHubにおける個人情報の取り扱いについて定めたプライバシーポリシーです。',
  },
};

const FALLBACK: Meta = {
  title: `ページが見つかりません｜${brand.name}`,
  description: 'お探しのページは見つかりませんでした。',
};

const ORIGIN = `https://${brand.domain}`;
const LD_ID = 'route-structured-data';

/** ルートごとのJSON-LD（パンくず＋ページ種別）を組み立てる */
function buildStructuredData(pathname: string, meta: Meta) {
  const graph: Record<string, unknown>[] = [];

  // --- パンくず（トップ以外） ---
  const nav = navItems.find((n) => n.to === pathname);
  if (pathname !== '/' && nav) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: nav.labelJa, item: `${ORIGIN}${pathname}` },
      ],
    });
  }

  // --- FAQ（事業者情報ページ）: 検索結果にQ&Aが展開される ---
  if (pathname === '/about') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  // --- 代表者ページ ---
  if (pathname === '/founder') {
    graph.push({
      '@type': 'Person',
      name: '三好 智',
      jobTitle: '代表',
      description: meta.description,
      worksFor: { '@id': `${ORIGIN}/#business` },
      url: `${ORIGIN}/founder`,
    });
  }

  return graph.length > 0 ? { '@context': 'https://schema.org', '@graph': graph } : null;
}

/** ルートに応じて title / description / canonical / 構造化データ を書き換える */
export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = META[pathname] ?? FALLBACK;
    const url = `${ORIGIN}${pathname}`;

    document.title = meta.title;

    const setTag = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    setTag('meta[name="description"]', 'content', meta.description);
    setTag('meta[property="og:title"]', 'content', meta.title);
    setTag('meta[property="og:description"]', 'content', meta.description);
    setTag('meta[property="og:url"]', 'content', url);
    setTag('meta[name="twitter:title"]', 'content', meta.title);
    setTag('meta[name="twitter:description"]', 'content', meta.description);
    setTag('link[rel="canonical"]', 'href', url);

    // 存在しないページは検索結果に載せない
    setTag(
      'meta[name="robots"]',
      'content',
      META[pathname] ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow',
    );

    // --- ルート固有の構造化データを差し替える ---
    document.getElementById(LD_ID)?.remove();
    const data = buildStructuredData(pathname, meta);
    if (data) {
      const script = document.createElement('script');
      script.id = LD_ID;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}
