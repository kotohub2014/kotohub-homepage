import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import Reveal from '../components/Reveal';
import SpotlightCard from '../components/SpotlightCard';
import Counter from '../components/Counter';
import CTA from '../components/CTA';
import { ArrowRight, ServiceIcon } from '../components/Icons';
import { brand, caseStudies, products, services, stats, strengthEquation, strengths } from '../data/content';

const KEYWORDS = [
  'DX SUPPORT',
  'AI INTEGRATION',
  'CUSTOM APPLICATION',
  'CLOUD MIGRATION',
  'DATA ANALYTICS',
  'WEB PRODUCTION',
  'SUBSCRIPTION CATALOG',
  'FULL-STACK ENGINEERING',
];

const line = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: '0%',
    transition: { delay: 0.15 + i * 0.13, duration: 1.05, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Home() {
  return (
    <div className="page page--flush">
      {/* ============================ HERO ============================ */}
      <section className="hero">
        <span className="hero__kanji" aria-hidden="true">
          事
        </span>

        <div className="hero__inner">
          <motion.div
            className="hero__badge"
            variants={fadeUp}
            custom={0.05}
            initial="hidden"
            animate="show"
          >
            <span className="hero__badge-dot" />
            DX / AI PARTNER FOR JAPANESE SMB
          </motion.div>

          <h1 className="hero__title">
            <span className="hero__title-line">
              <motion.span
                className="hero__title-inner gold-text gold-text--shimmer"
                variants={line}
                custom={0}
                initial="hidden"
                animate="show"
              >
                それ、
              </motion.span>
            </span>
            <span className="hero__title-line">
              <motion.span
                className="hero__title-inner gold-text gold-text--shimmer"
                variants={line}
                custom={1}
                initial="hidden"
                animate="show"
              >
                やれますよ。
              </motion.span>
            </span>
            <motion.span
              className="hero__title-sub"
              variants={fadeUp}
              custom={0.75}
              initial="hidden"
              animate="show"
            >
              {brand.catchEn}
            </motion.span>
          </h1>

          <motion.p className="hero__lead" variants={fadeUp} custom={0.9} initial="hidden" animate="show">
            {/* 日本語の途中に半角スペースが入らないよう、改行を挟まず1行で記述する */}
            <strong>AI駆動開発</strong>のスピードと、<strong>フルスタックエンジニア</strong>の堅実な技術設計。その掛け算で、日本の中小企業のDXを「構想」で終わらせず<strong>「実装」</strong>まで届けます。
          </motion.p>

          <motion.div
            className="hero__actions"
            variants={fadeUp}
            custom={1.05}
            initial="hidden"
            animate="show"
          >
            <Link to="/contact" className="btn btn--primary">
              無料で相談する
              <ArrowRight className="btn__arrow" />
            </Link>
            <Link to="/services" className="btn btn--ghost">
              できることを見る
              <ArrowRight className="btn__arrow" />
            </Link>
          </motion.div>
        </div>

        <span className="hero__side" aria-hidden="true">
          KOTOHUB — EST. IN JAPAN
        </span>

        <motion.div
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          aria-hidden="true"
        >
          <span>SCROLL</span>
          <span className="hero__scroll-line" />
        </motion.div>
      </section>

      {/* ========================== MARQUEE =========================== */}
      <div className="marquee" aria-hidden="true">
        {[0, 1].map((k) => (
          <div className="marquee__track" key={k}>
            {KEYWORDS.map((word) => (
              <span className="marquee__item" key={word}>
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* =========================== STATS ============================ */}
      <div className="container container--wide">
        <div className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <p className="stat__value gold-text">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="stat__label">{s.label}</p>
              <p className="stat__note">{s.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================= CASE STUDIES ======================== */}
      <section className="section" id="cases" aria-labelledby="cases-heading">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow--center">Case studies</p>
            <h2 className="section-title" id="cases-heading">
              <span className="en gold-text" aria-hidden="true">
                Cases
              </span>
              たとえば、こんなことができます。
            </h2>
            <p className="section-lead">
              「うちの業務でAIなんて使えるのか」——いちばん多いご質問です。実際にKotoHubの技術で実現できる構成を、業種別にご紹介します。
            </p>
          </Reveal>

          <div className="case-grid">
            {caseStudies.map((c, i) => (
              <Reveal key={c.id} delay={(i % 2) * 0.08}>
                <SpotlightCard className="case-card">
                  <article>
                    <header className="case-card__head">
                      <span className="case-card__industry">
                        <ServiceIcon name={c.icon} className="case-card__icon" />
                        {c.industry}
                      </span>
                      <span className="case-card__no" aria-hidden="true">
                        CASE {String(i + 1).padStart(2, '0')}
                      </span>
                    </header>

                    <h3 className="case-card__title gold-text">{c.title}</h3>

                    <dl className="case-card__list">
                      <dt className="case-card__term case-card__term--problem">課題</dt>
                      <dd className="case-card__desc">{c.problem}</dd>

                      <dt className="case-card__term">KotoHubの打ち手</dt>
                      <dd className="case-card__desc">{c.solution}</dd>

                      <dt className="case-card__term case-card__term--result">結果</dt>
                      <dd className="case-card__desc case-card__desc--result">{c.result}</dd>
                    </dl>

                    <ul className="case-card__tech" aria-label="使用する主な技術">
                      {c.tech.map((t) => (
                        <li className="case-card__tech-item" key={t}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </article>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.05}>
            <p className="case-note">
              ※ 上記はKotoHubが対応可能な技術構成をもとにした想定シナリオです。実在の企業名・実測値ではありません。実際のご要件に合わせて設計・お見積りいたします。
            </p>
            <div className="text-center" style={{ marginTop: 34 }}>
              <Link to="/contact" className="btn btn--primary">
                自社の場合を相談する
                <ArrowRight className="btn__arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================== CONCEPT =========================== */}
      <section className="section" id="concept" aria-labelledby="concept-heading">
        <div className="container">
          <div className="concept">
            <Reveal>
              <p className="eyebrow">Concept</p>
              <h2 className="section-title" id="concept-heading">
                <span className="en gold-text" aria-hidden="true">
                  Concept
                </span>
                {brand.concept.title}
              </h2>

              <div className="concept__mark" aria-hidden="true">
                <span className="concept__ring" />
                <span className="concept__ring concept__ring--2" />
                <span className="concept__ring concept__ring--3" />
                <span className="concept__kanji gold-text gold-text--shimmer">事</span>
                <span className="concept__kanji-note">KOTO — MATTERS THAT MOVE</span>
              </div>
            </Reveal>

            <Reveal className="concept__body" delay={0.12}>
              {brand.concept.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <div style={{ marginTop: 34 }}>
                <Link to="/about" className="link-arrow">
                  事業者情報を見る
                  <ArrowRight />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================== SERVICES ========================== */}
      <section className="section" id="services" aria-labelledby="services-heading">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow--center">Services</p>
            <h2 className="section-title" id="services-heading">
              <span className="en gold-text" aria-hidden="true">
                Services
              </span>
              できること、ぜんぶ。
            </h2>
            <p className="section-lead">
              「作って終わり」にしないために、上流の相談から運用・内製化まで。中小企業のDXに必要なものを、一つの窓口でご提供します。
            </p>
          </Reveal>

          <div className="svc-grid" style={{ marginTop: 54 }}>
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.09}>
                <SpotlightCard className="svc-card">
                  <div className="svc-card__head">
                    <span className="svc-card__no">{s.no}</span>
                    <ServiceIcon name={s.icon} className="svc-card__icon" />
                  </div>
                  <h3 className="svc-card__title">{s.title}</h3>
                  <p className="svc-card__en">{s.titleEn}</p>
                  <p className="svc-card__summary">{s.summary}</p>
                  <Link to={`/services#${s.id}`} className="link-arrow svc-card__more">
                    詳しく見る
                    <ArrowRight />
                  </Link>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== STRENGTH ========================== */}
      <section className="section" id="strengths" aria-labelledby="strengths-heading">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow--center">Our strength</p>
            <h2 className="section-title" id="strengths-heading">
              <span className="en gold-text" aria-hidden="true">
                Strength
              </span>
              速さと堅さは、両立できる。
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="equation" style={{ marginTop: 46 }}>
              <div className="equation__term">
                <p className="equation__label gold-text">
                  {strengthEquation.left.label}
                  <span className="equation__sub">{strengthEquation.left.sub}</span>
                </p>
              </div>
              <span className="equation__op" aria-hidden="true">
                ×
              </span>
              <div className="equation__term">
                <p className="equation__label gold-text">
                  {strengthEquation.right.label}
                  <span className="equation__sub">{strengthEquation.right.sub}</span>
                </p>
              </div>
              <span className="equation__op" aria-hidden="true">
                =
              </span>
              <div className="equation__term equation__result">
                <p className="equation__label gold-text gold-text--shimmer">
                  {strengthEquation.result.label}
                  <span className="equation__sub">{strengthEquation.result.sub}</span>
                </p>
              </div>
            </div>
          </Reveal>

          <div style={{ marginTop: 30 }}>
            {strengths.map((s, i) => (
              <Reveal key={s.no} delay={i * 0.06}>
                <div className="strength">
                  <p className="strength__no gold-text">{s.no}</p>
                  <div>
                    <h3 className="strength__title">{s.title}</h3>
                    <p className="strength__body">{s.body}</p>
                    <div className="strength__points">
                      {s.points.map((p) => (
                        <span className="pill" key={p}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center" delay={0.05}>
            <div style={{ marginTop: 46 }}>
              <Link to="/strengths" className="btn btn--ghost">
                強みと開発の進め方を見る
                <ArrowRight className="btn__arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================== PRODUCTS ========================== */}
      <section className="section" id="products" aria-labelledby="products-heading">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow--center">Product catalog</p>
            <h2 className="section-title" id="products-heading">
              <span className="en gold-text" aria-hidden="true">
                Products
              </span>
              作る前に、まず使ってみる。
            </h2>
            <p className="section-lead">
              KotoHubが保有するプロダクトを、月額サブスクリプションで貸し出します。初期開発費をかけずに始められ、御社仕様へのカスタマイズや買い切りへの移行も可能です。
            </p>
          </Reveal>

          <div className="prod-grid" style={{ marginTop: 54 }}>
            {products.slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.09}>
                <SpotlightCard className="prod-card">
                  <div className="prod-card__top">
                    <div className="prod-card__meta">
                      <span className="tag">{p.tag}</span>
                      <span className={`badge badge--${p.status}`}>
                        {p.status === 'available' ? 'AVAILABLE' : p.status === 'beta' ? 'BETA' : 'COMING SOON'}
                      </span>
                    </div>
                    <h3 className="prod-card__name gold-text">{p.name}</h3>
                    <p className="prod-card__copy">{p.copy}</p>
                  </div>
                  <div className="prod-card__body">
                    <p className="prod-card__desc">{p.description}</p>
                    <div className="prod-card__price-wrap" style={{ borderTop: 'none', paddingTop: 0 }}>
                      <p className="prod-card__price gold-text">{p.price}</p>
                      <p className="prod-card__price-note">{p.priceNote}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center" delay={0.05}>
            <div style={{ marginTop: 46 }}>
              <Link to="/products" className="btn btn--ghost">
                プロダクト一覧を見る
                <ArrowRight className="btn__arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTA />
    </div>
  );
}
