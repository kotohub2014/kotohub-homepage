import { Link } from 'react-router-dom';
import Logo from './Logo';
import { brand, navItems, services } from '../data/content';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Logo />
            <p className="footer__desc">
              {brand.catch}
              <br />
              日本の中小企業をITで手助けする、DX・AI導入のパートナー。要件定義から開発・運用・内製化支援まで一貫して伴走します。
            </p>
          </div>

          <div>
            <p className="footer__title">SITEMAP</p>
            <ul className="footer__list">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noopener noreferrer' : undefined}>
                    {item.labelJa}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer__title">SERVICES</p>
            <ul className="footer__list">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={`/services#${s.id}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {brand.name}. All rights reserved.
          </span>
          <div className="footer__bottom-links">
            <Link to="/privacy">プライバシーポリシー</Link>
            <Link to="/about">事業者情報</Link>
            <Link to="/contact">お問い合わせ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
