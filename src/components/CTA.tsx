import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { ArrowRight } from './Icons';

type Props = {
  title?: string;
  lead?: string;
};

/** 全ページ共通のクロージング導線 */
export default function CTA({
  title = 'その課題、ITで解けるか一緒に確かめませんか。',
  lead = 'ご相談・お見積りは無料です。「何から始めればいいか分からない」段階でも構いません。現状をお伺いした上で、費用対効果の見込める打ち手からご提案します。',
}: Props) {
  return (
    <section className="cta">
      <div className="container">
        <Reveal className="cta__inner">
          <p className="eyebrow eyebrow--center">Let's talk</p>
          <h2 className="cta__title">
            <span className="gold-text gold-text--shimmer">{title}</span>
          </h2>
          <p className="cta__lead">{lead}</p>
          <div className="cta__actions">
            <Link to="/contact" className="btn btn--primary">
              無料で相談する
              <ArrowRight className="btn__arrow" />
            </Link>
            <Link to="/services" className="btn btn--ghost">
              事業内容を見る
              <ArrowRight className="btn__arrow" />
            </Link>
          </div>
          <p className="cta__note">全国オンライン対応 ／ 相談だけでもOK ／ 無理な営業は一切いたしません</p>
        </Reveal>
      </div>
    </section>
  );
}
