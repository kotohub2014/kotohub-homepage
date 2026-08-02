import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { brand } from '../data/content';

type Meta = { title: string; description: string };

const META: Record<string, Meta> = {
  '/': {
    title: `${brand.name}｜${brand.catch} - 中小企業のDX・AI導入パートナー`,
    description:
      'KotoHub（コトハブ）は日本の中小企業をITで手助けする個人事業主です。AI駆動開発 × フルスタック設計で、DX・AI導入・アプリ開発・クラウド移行・データ分析を低コストで実現します。',
  },
  '/services': {
    title: `事業内容｜${brand.name}`,
    description:
      'プロダクトのサブスク提供、オリジナルアプリ開発、ホームページ制作、クラウド移行、データ分析、AI導入。中小企業のDXに必要な6つのサービスをご提供します。',
  },
  '/products': {
    title: `プロダクト｜${brand.name}`,
    description:
      'KotoHubが保有するプロダクトを月額サブスクリプションで貸し出します。初期開発費を抑えて、AIチャット・BIダッシュボード・業務自動化をすぐに導入できます。',
  },
  '/strengths': {
    title: `強み｜${brand.name}`,
    description:
      'AI駆動開発による高速開発 × フルスタックエンジニアの安定した技術設計 = 開発コストの削減。KotoHubが提供できる価値と開発の進め方をご紹介します。',
  },
  '/about': {
    title: `事業者情報｜${brand.name}`,
    description: 'KotoHubの屋号・事業内容・対応エリア・技術スタック・お取引の考え方についてご案内します。',
  },
  '/contact': {
    title: `お問い合わせ｜${brand.name}`,
    description:
      'ご相談・お見積りは無料です。DX、AI導入、システム開発についてお気軽にお問い合わせください。全国オンライン対応。',
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

/** ルートに応じて title / description / canonical を書き換える */
export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = META[pathname] ?? FALLBACK;
    document.title = meta.title;

    const setTag = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    setTag('meta[name="description"]', 'content', meta.description);
    setTag('meta[property="og:title"]', 'content', meta.title);
    setTag('meta[property="og:description"]', 'content', meta.description);
    setTag('meta[property="og:url"]', 'content', `https://${brand.domain}${pathname}`);
    setTag('link[rel="canonical"]', 'href', `https://${brand.domain}${pathname}`);
  }, [pathname]);

  return null;
}
