import { Link } from 'react-router-dom';
import { ArrowRight } from '../components/Icons';

export default function NotFound() {
  return (
    <div className="page">
      <div className="container nf">
        <div>
          <p className="nf__code gold-text gold-text--shimmer">404</p>
          <h1 className="section-title" style={{ marginTop: 10 }}>
            ページが見つかりませんでした
          </h1>
          <p className="section-lead" style={{ marginInline: 'auto' }}>
            お探しのページは移動または削除された可能性があります。
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn--primary">
              ホームへ戻る
              <ArrowRight className="btn__arrow" />
            </Link>
            <Link to="/contact" className="btn btn--ghost">
              お問い合わせ
              <ArrowRight className="btn__arrow" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
