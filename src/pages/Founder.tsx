import { Link } from 'react-router-dom';

import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import CTA from '../components/CTA';
import FounderPhoto from '../components/FounderPhoto';
import { ArrowRight } from '../components/Icons';
import { founder } from '../data/content';

export default function Founder() {
  const age = new Date().getFullYear() - founder.born;

  return (
    <div className="page">
      <PageHead
        eyebrow="Founder"
        en="FOUNDER"
        title={
          <>
            代表を、
            <span className="gold-text gold-text--shimmer">知る。</span>
          </>
        }
        lead="KotoHubの現場は、代表である三好 智が最後まで責任を持って担当します。どんな人物か、簡単にご紹介します。"
      />

      {/* プロフィール */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <Reveal>
            <div className="founder-hero">
              <FounderPhoto />
              <div>
                <p className="eyebrow">Profile</p>
                {/* ページのh1は PageHead 側。ここはh2にして見出し階層を保つ */}
                <h2 className="founder-name">{founder.name}</h2>
                <p className="founder-name-en">{founder.nameEn}</p>
                <div className="founder-meta">
                  <span className="pill">{founder.role}</span>
                  <span className="pill">{founder.born}年生まれ（{age}歳）</span>
                </div>
                <p className="founder-summary">{founder.summary}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 職務経歴 */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">Career</p>
            <h2 className="section-title">
              <span className="en gold-text" aria-hidden="true">
                Career
              </span>
              これまでの経歴
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="timeline" style={{ marginTop: 44 }}>
              {founder.career.map((c) => (
                <div className="timeline__item" key={c.company + c.period}>
                  <span className="timeline__dot" aria-hidden="true" />
                  <p className="timeline__period">{c.period}</p>
                  <h3 className="timeline__company">{c.company}</h3>
                  <span className="timeline__project">{c.role}</span>
                  <p className="timeline__desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ marginTop: 30 }}>
              <Link to="/about" className="link-arrow">
                事業者情報へ戻る
                <ArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA
        title="この人物が、直接お話を伺います。"
        lead="窓口と担当者が分かれている、ということがありません。三好本人が最後までお話を伺い、対応します。"
      />
    </div>
  );
}
