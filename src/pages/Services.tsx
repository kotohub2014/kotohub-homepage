import { Link } from 'react-router-dom';

import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import CTA from '../components/CTA';
import { ArrowRight, ServiceIcon } from '../components/Icons';
import { services } from '../data/content';

export default function Services() {
  return (
    <div className="page">
      <PageHead
        eyebrow="Services"
        en="SERVICES"
        title={
          <>
            できること、
            <span className="gold-text gold-text--shimmer">ぜんぶ。</span>
          </>
        }
        lead="ホームページ1枚から、基幹業務を支えるシステムまで。KotoHubは、中小企業のDXに必要な工程を一つの窓口で引き受けます。「どのサービスを頼めばいいか分からない」という段階でも構いません。まずは課題からお聞かせください。"
      />

      {/* 目次 */}
      <div className="container" style={{ paddingTop: 34 }}>
        <Reveal>
          <div className="strength__points">
            {services.map((s) => (
              <Link className="pill" to={`/services#${s.id}`} key={s.id}>
                {s.no}. {s.title}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>

      <section className="section" style={{ paddingTop: 46 }}>
        <div className="container">
          {services.map((s) => (
            <Reveal className="svc-row" id={s.id} key={s.id}>
              <div className="svc-row__aside">
                <p className="svc-row__no gold-text">{s.no}</p>
                <ServiceIcon name={s.icon} className="svc-row__icon" />
                <h2 className="svc-row__title">{s.title}</h2>
                <p className="svc-row__en">{s.titleEn}</p>
              </div>

              <div>
                <p className="svc-row__detail">{s.detail}</p>

                <div className="svc-row__cols">
                  <div>
                    <p className="svc-row__sub">できること</p>
                    <ul className="check-list">
                      {s.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="svc-row__sub">主な納品物</p>
                    <ul className="dot-list">
                      {s.deliverables.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: 32 }}>
                  <Link to="/contact" className="link-arrow">
                    このサービスを相談する
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 料金の考え方 */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">Pricing policy</p>
            <h2 className="section-title">料金の考え方</h2>
            <p className="section-lead">
              費用は「どこまで作るか」で決まります。KotoHubでは、ご予算をお伺いした上で、
              その範囲で最も効果の出る範囲を切り出してご提案します。無理に全部を作る必要はありません。
            </p>
          </Reveal>

          <div className="benefit-grid" style={{ marginTop: 40 }}>
            {[
              {
                title: '月額サブスクリプション',
                body: '既存プロダクトの貸し出し。初期費用を抑え、月額で始められます。まず効果を確かめたい方へ。',
                price: '¥15,000〜 / 月',
              },
              {
                title: '請負（一括開発）',
                body: '要件を固めて開発・納品する形式。ソースコードと技術ドキュメントをお渡しします。',
                price: '¥300,000〜',
              },
              {
                title: '技術顧問・準委任',
                body: '月◯時間の枠で継続的に伴走。相談・改善・内製化支援を柔軟に対応します。',
                price: '¥100,000〜 / 月',
              },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="benefit">
                  <p className="benefit__num">PLAN 0{i + 1}</p>
                  <h3 className="benefit__title">{p.title}</h3>
                  <p className="benefit__body">{p.body}</p>
                  <p className="prod-card__price gold-text" style={{ marginTop: 20, fontSize: 21 }}>
                    {p.price}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p style={{ marginTop: 26, fontSize: 12.5, color: 'var(--text-faint)', lineHeight: 2 }}>
              ※ 記載価格はいずれも税別の目安です。要件・規模により変動します。正式なお見積りは無料でご提示します。
            </p>
          </Reveal>
        </div>
      </section>

      <CTA
        title="どのサービスが合うか、一緒に選びます。"
        lead="「システムを作るべきか、既存プロダクトで足りるか」から一緒に検討します。売り込みではなく、費用対効果の判断材料をお渡しすることを大切にしています。"
      />
    </div>
  );
}
