import { Link } from 'react-router-dom';

import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import CTA from '../components/CTA';
import { ArrowRight } from '../components/Icons';
import { products, productBenefits } from '../data/content';

/**
 * 自社サービスの紹介ページ。
 *
 * **公開しているものだけを載せる。** 広告配信・決済の審査では、
 * 運営者とサービスがこのページから辿れることを見られるため、
 * 各サービスへの導線（外部リンク）を必ず置いておく。
 */
export default function Products() {
  return (
    <div className="page">
      <PageHead
        eyebrow="Our products"
        en="PRODUCTS"
        title={
          <>
            受託だけでなく、
            <span className="accent-text">自分たちでも作って運営しています。</span>
          </>
        }
        lead="KotoHub は、お客様のシステムを開発するだけでなく、自社サービスの開発・運営も行っています。企画から設計・開発・公開・運用まで自分たちで回しているからこそ、机上ではない提案ができます。どちらも公開中で、どなたでもご利用いただけます。"
      />

      {/* --- 公開中のサービス --- */}
      <section className="section" style={{ paddingTop: 56 }} aria-labelledby="products-heading">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Services in operation</p>
            <h2 className="section-title" id="products-heading">
              公開中のサービス
            </h2>
            <p className="section-lead">いずれもブラウザだけで利用できます。インストールは不要です。</p>
          </Reveal>

          <div className="product-grid">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <article className="product-card">
                  <header className="product-card__head">
                    <p className="product-card__tag">{p.tag}</p>
                    <h3 className="product-card__name">{p.name}</h3>
                    <p className="product-card__copy">{p.copy}</p>
                  </header>

                  <p className="product-card__body">{p.description}</p>

                  <ul className="product-card__features">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>

                  <dl className="product-card__meta">
                    <div>
                      <dt>料金</dt>
                      <dd>
                        {p.price}
                        <span className="product-card__note">{p.priceNote}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>公開URL</dt>
                      <dd>{p.urlLabel}</dd>
                    </div>
                  </dl>

                  <a className="btn btn--primary btn--sm" href={p.url} target="_blank" rel="noopener">
                    {p.name} を開く
                    <ArrowRight className="btn__arrow" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- 自社サービスから受託開発へ、どうつながるか --- */}
      <section className="section" aria-labelledby="why-heading">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Why we build our own</p>
            <h2 className="section-title" id="why-heading">
              自分たちで運営しているから、話が早い
            </h2>
            <p className="section-lead">自社サービスの運営で得た知見は、そのままお客様の案件に使えます。</p>
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

      {/* --- 受託開発という選択肢 --- */}
      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="custom-heading">
        <div className="container">
          <Reveal>
            <p className="eyebrow">For your business</p>
            <h2 className="section-title" id="custom-heading">
              御社専用のシステムをつくる
            </h2>
            <p className="section-lead">
              上記は当社が運営しているサービスです。御社の業務に合わせたシステム・アプリ・ホームページの開発は
              <Link to="/services">事業内容</Link>
              のページをご覧ください。要件定義から設計・開発・運用まで一貫してお受けします。
            </p>
          </Reveal>
        </div>
      </section>

      <CTA
        title="「こういうものが欲しい」から、はじめましょう。"
        lead="自社サービスで培った開発力で、御社の業務に合わせた仕組みをつくります。ご相談・お見積りは無料です。"
      />
    </div>
  );
}
