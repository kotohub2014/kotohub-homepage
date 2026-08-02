import { Link } from 'react-router-dom';
import { brand } from '../data/content';

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="logo" onClick={onClick} aria-label={`${brand.name} ホームへ`}>
      <svg className="logo__mark" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="logoGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8C6A1E" />
            <stop offset="45%" stopColor="#F7E08C" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C6A1E" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#logoGold)" strokeWidth="3.4" strokeLinecap="round">
          <circle cx="32" cy="32" r="7.5" />
          <path d="M32 8.5v9M32 46.5v9M8.5 32h9M46.5 32h9" />
          <path d="M15.6 15.6l6.4 6.4M42 42l6.4 6.4M48.4 15.6L42 22M22 42l-6.4 6.4" opacity=".6" />
        </g>
      </svg>
      <span>
        <span className="logo__text gold-text">{brand.name}</span>
        <span className="logo__sub">DX / AI PARTNER</span>
      </span>
    </Link>
  );
}
