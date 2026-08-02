import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import CTA from '../components/CTA';
import { flow, strengthEquation, strengths, techStack } from '../data/content';

export default function Strengths() {
  return (
    <div className="page">
      <PageHead
        eyebrow="Our strength"
        en="STRENGTH"
        title={
          <>
            速さと堅さは、
            <span className="gold-text gold-text--shimmer">両立できる。</span>
          </>
        }
        lead="「速い開発は雑」「丁寧な開発は高い」——その二択を崩すのがKotoHubの仕事です。AIを使い倒して手を速く動かし、設計だけは絶対に手を抜かない。結果として、御社の開発コストが下がります。"
      />

      {/* 方程式 */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <Reveal>
            <div className="equation">
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
                    <h2 className="strength__title">{s.title}</h2>
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
        </div>
      </section>

      {/* 開発フロー */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">Process</p>
            <h2 className="section-title">
              <span className="en gold-text" aria-hidden="true">
                Process
              </span>
              ご相談から運用まで
            </h2>
            <p className="section-lead">
              最初から完璧な仕様は求めません。動くものを早めにお見せして、そこから一緒に精度を上げていく進め方です。
            </p>
          </Reveal>

          <div className="flow" style={{ marginTop: 48 }}>
            {flow.map((f, i) => (
              <Reveal key={f.step} delay={(i % 3) * 0.08}>
                <div className="flow__item">
                  <div className="flow__step">
                    <span>{f.step}</span>
                    <span className="flow__duration">{f.duration}</span>
                  </div>
                  <h3 className="flow__title">{f.title}</h3>
                  <p className="flow__body">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 技術スタック */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">Tech stack</p>
            <h2 className="section-title">
              <span className="en gold-text" aria-hidden="true">
                Tech
              </span>
              対応技術
            </h2>
            <p className="section-lead">
              技術は目的ではなく手段です。流行りだからではなく、御社が5年後も無理なく運用できる構成を選びます。
              ここに無い技術でも、既存システムに合わせて対応可能な場合があります。
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="tech" style={{ marginTop: 44 }}>
              {techStack.map((group) => (
                <div className="tech__col" key={group.category}>
                  <p className="tech__cat">{group.category}</p>
                  <ul className="tech__items">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTA
        title="まずは、いまの課題を聞かせてください。"
        lead="技術の話は後回しで構いません。「毎月この作業に何十時間かかっている」——そんな話から、削れるところを一緒に探します。"
      />
    </div>
  );
}
