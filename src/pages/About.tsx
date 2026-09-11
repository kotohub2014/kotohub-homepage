import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import Faq from '../components/Faq';
import CTA from '../components/CTA';
import { ArrowRight } from '../components/Icons';
import { brand, businessInfo, faqs, serviceLegalLinks, values } from '../data/content';

export default function About() {
  return (
    <div className="page">
      <PageHead
        eyebrow="About"
        en="ABOUT"
        title={
          <>
            <span className="gold-text gold-text--shimmer">「やれますよ」</span>
            と言える技術者が、いちばん強い。
          </>
        }
        lead={brand.concept.body[0]}
      />

      {/* コンセプト本文 */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="concept">
            <Reveal>
              <p className="eyebrow">Concept</p>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                屋号「KotoHub」に
                <br />
                込めたこと
              </h2>
              <div className="concept__mark" aria-hidden="true" style={{ marginTop: 30 }}>
                <span className="concept__ring" />
                <span className="concept__ring concept__ring--2" />
                <span className="concept__ring concept__ring--3" />
                <span className="concept__kanji gold-text gold-text--shimmer">事</span>
                <span className="concept__kanji-note">KOTO — MATTERS THAT MOVE</span>
              </div>
            </Reveal>

            <Reveal className="concept__body" delay={0.1}>
              {brand.concept.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 大切にしていること */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">Values</p>
            <h2 className="section-title">
              <span className="en gold-text" aria-hidden="true">
                Values
              </span>
              仕事で大切にしていること
            </h2>
          </Reveal>

          <div className="value-grid" style={{ marginTop: 44 }}>
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.08}>
                <div className="value">
                  <h3 className="value__title gold-text">{v.title}</h3>
                  <p className="value__body">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 事業者概要 */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">Business information</p>
            <h2 className="section-title">
              <span className="en gold-text" aria-hidden="true">
                Profile
              </span>
              事業者概要
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <table className="info-table" style={{ marginTop: 40 }}>
              <tbody>
                {businessInfo.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>
                      {row.label === '代表者' ? (
                        <a href="/founder" target="_blank" rel="noopener noreferrer" className="founder-link">
                          <span className="founder-link__row">
                            {row.value}
                            <ArrowRight className="founder-link__arrow" />
                          </span>
                          <span className="founder-link__note">代表者プロフィールを見る（別タブで開きます）</span>
                        </a>
                      ) : (
                        row.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          {/* 運営サービスの法務ページ。**事業者情報からたどれるようにしておく。**
              広告配信や決済の審査で、運営者・特定商取引法の表示・規約が
              1 か所から辿れることを見られる */}
          <Reveal delay={0.12}>
            <h3 className="section-subtitle" style={{ marginTop: 56 }}>
              運営サービスの法務情報
            </h3>
            <ul className="legal-links">
              {serviceLegalLinks.map((link) => (
                <li key={link.href} className="legal-links__item">
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <span className="legal-links__label">{link.label}</span>
                    <span className="legal-links__note">{link.note}</span>
                    <ArrowRight className="legal-links__arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title">
              <span className="en gold-text" aria-hidden="true">
                FAQ
              </span>
              よくあるご質問
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div style={{ marginTop: 40 }}>
              <Faq items={faqs} />
            </div>
          </Reveal>
        </div>
      </section>

      <CTA />
    </div>
  );
}
