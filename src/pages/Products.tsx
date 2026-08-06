import { Link } from 'react-router-dom';

import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import CTA from '../components/CTA';
import { ArrowRight } from '../components/Icons';
import { productBenefits } from '../data/content';

/**
 * プロダクトカタログ（準備中）。
 *
 * 自社プロダクトはまだ提供していないため、具体的な製品名・価格は載せない。
 * ここでは「これから用意しようとしている形」だけを説明している。
 * 提供開始したら、この Coming Soon ブロックを製品一覧に差し替える。
 */
export default function Products() {
  return (
    <div className="page">
      <PageHead
        eyebrow="Product catalog"
        en="PRODUCTS"
        title={
          <>
            作る前に、
            <span className="gold-text gold-text--shimmer">まず使えるものを。</span>
          </>
        }
        lead="数百万円規模のスクラッチ開発に踏み切る前に、月額で試せる自社プロダクトを準備しています。まず動くものを現場に入れて効果を確かめる——そんな始め方をご用意していきます。"
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <Reveal>
            <div className="coming-soon" style={{ marginTop: 0 }}>
              <p className="coming-soon__label">Coming Soon</p>
              <p className="coming-soon__title gold-text gold-text--shimmer">準備中です</p>
              <p className="coming-soon__body">
                現在ご提供できるのは受託開発のみです。自社プロダクトは開発を進めており、提供開始までもうしばらくお待ちください。「こういうものが月額で使えたら」というご要望は、そのまま開発の優先順位に反映します。
              </p>
              <Link to="/contact" className="btn btn--primary btn--sm">
                要望を伝える
                <ArrowRight className="btn__arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- どんな形で提供しようとしているか --- */}
      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="plan-heading">
        <div className="container">
          <Reveal>
            <p className="eyebrow">What we are building</p>
            <h2 className="section-title" id="plan-heading">
              <span className="en gold-text" aria-hidden="true">
                Plan
              </span>
              目指しているかたち
            </h2>
            <p className="section-lead">
              ゼロから作ると、どうしても時間と費用がかかります。それを月額で置き換えられる形にするのが、いま準備している仕組みです。
            </p>
          </Reveal>

          <div className="benefit-grid" style={{ marginTop: 44 }}>
            {productBenefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="benefit">
                  <p className="benefit__num">POINT 0{i + 1}</p>
                  <h3 className="benefit__title">{b.title}</h3>
                  <p className="benefit__body">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- サブスクと受託開発の違い --- */}
      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="compare-heading">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Subscription or Custom</p>
            <h2 className="section-title" id="compare-heading">
              サブスクと受託開発、どちらを選ぶか
            </h2>
            <p className="section-lead">
              いまお選びいただけるのは受託開発です。将来サブスクをご用意した際に、どちらが向いているかの目安として整理しておきます。
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              className="tech"
              style={{ marginTop: 40, gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}
            >
              <div className="tech__col">
                <p className="tech__cat">SUBSCRIPTION — 貸し出し（準備中）</p>
                <ul className="dot-list" style={{ marginTop: 6 }}>
                  <li>初期費用を大きく抑えられる</li>
                  <li>導入は最短数日〜数週間</li>
                  <li>保守・アップデートは月額に込み</li>
                  <li>解約すれば利用は終了する</li>
                  <li>まず効果を確かめたい場合に最適</li>
                </ul>
              </div>
              <div className="tech__col">
                <p className="tech__cat">CUSTOM — 受託開発（提供中）</p>
                <ul className="dot-list" style={{ marginTop: 6 }}>
                  <li>業務に完全に合わせて設計できる</li>
                  <li>ソースコードは御社の資産になる</li>
                  <li>長期的にはコストが逆転しうる</li>
                  <li>初期費用と開発期間が必要</li>
                  <li>要件が固まっている場合に最適</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA
        title="いまは、御社専用に作るところから。"
        lead="プロダクトの提供開始までは、受託開発でご要望にお応えします。まずはどんな業務を楽にしたいか、お聞かせください。"
      />
    </div>
  );
}
