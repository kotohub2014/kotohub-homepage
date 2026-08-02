import { Link } from 'react-router-dom';

import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import SpotlightCard from '../components/SpotlightCard';
import CTA from '../components/CTA';
import { ArrowRight } from '../components/Icons';
import { productBenefits, products } from '../data/content';

const STATUS_LABEL: Record<string, string> = {
  available: 'AVAILABLE',
  beta: 'BETA',
  coming: 'COMING SOON',
};

export default function Products() {
  return (
    <div className="page">
      <PageHead
        eyebrow="Product catalog"
        en="PRODUCTS"
        title={
          <>
            作る前に、
            <span className="gold-text gold-text--shimmer">まず使ってみる。</span>
          </>
        }
        lead="KotoHubが自社で開発・保有するプロダクトを、月額サブスクリプションで貸し出します。数百万円規模のスクラッチ開発に踏み切る前に、まず動くものを業務に入れて効果を確かめる——そんな始め方をご用意しました。"
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="benefit-grid">
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

          <Reveal>
            <div style={{ marginTop: 84, marginBottom: 44 }}>
              <p className="eyebrow">Lineup</p>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                プロダクト一覧
              </h2>
            </div>
          </Reveal>

          <div className="prod-grid">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 0.09}>
                <SpotlightCard className="prod-card">
                  <div className="prod-card__top">
                    <div className="prod-card__meta">
                      <span className="tag">{p.tag}</span>
                      <span className={`badge badge--${p.status}`}>{STATUS_LABEL[p.status]}</span>
                    </div>
                    <h3 className="prod-card__name gold-text">{p.name}</h3>
                    <p className="prod-card__copy">{p.copy}</p>
                  </div>

                  <div className="prod-card__body">
                    <p className="prod-card__desc">{p.description}</p>

                    <div className="prod-card__features">
                      <ul className="check-list">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="prod-card__price-wrap">
                      <p className="prod-card__price gold-text">{p.price}</p>
                      <p className="prod-card__price-note">{p.priceNote}</p>
                      <Link to="/contact" className="btn btn--ghost btn--sm btn--block" style={{ marginTop: 20 }}>
                        このプロダクトを相談する
                        <ArrowRight className="btn__arrow" />
                      </Link>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p style={{ marginTop: 26, fontSize: 12.5, color: 'var(--text-faint)', lineHeight: 2 }}>
              ※ 価格はすべて税別の目安です。ご利用人数・データ量・カスタマイズ範囲により変動します。
              初期費用（環境構築・データ移行・操作説明）は別途お見積りいたします。
            </p>
          </Reveal>
        </div>
      </section>

      {/* サブスク vs 買い切り */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">Subscription or Custom</p>
            <h2 className="section-title">サブスクと受託開発、どちらを選ぶか</h2>
            <p className="section-lead">
              迷ったら、サブスクから始めるのがおすすめです。実際の業務に入れてみて初めて分かる要件が必ずあります。
              その学びを持ち込めば、受託開発に進んだときの精度が段違いに上がります。
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="tech" style={{ marginTop: 40, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <div className="tech__col">
                <p className="tech__cat">SUBSCRIPTION — 貸し出し</p>
                <ul className="dot-list" style={{ marginTop: 6 }}>
                  <li>初期費用を大きく抑えられる</li>
                  <li>導入は最短数日〜数週間</li>
                  <li>保守・アップデートは月額に込み</li>
                  <li>解約すれば利用は終了する</li>
                  <li>まず効果を確かめたい場合に最適</li>
                </ul>
              </div>
              <div className="tech__col">
                <p className="tech__cat">CUSTOM — 受託開発</p>
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
        title="どのプロダクトが効くか、業務からお選びします。"
        lead="「これ、うちの業務で使えますか？」というご質問が一番歓迎です。デモをご覧いただきながら、導入イメージを具体的にお伝えします。"
      />
    </div>
  );
}
