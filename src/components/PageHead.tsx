import type { ReactNode } from 'react';
import Reveal from './Reveal';

type Props = {
  eyebrow: string;
  en: string;
  title: ReactNode;
  lead?: ReactNode;
};

/** 下層ページ共通のヘッダー */
export default function PageHead({ eyebrow, en, title, lead }: Props) {
  return (
    <header className="page-head">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-head__title">{title}</h1>
          {lead && <p className="page-head__lead">{lead}</p>}
        </Reveal>
      </div>
      <span className="page-head__en gold-text" aria-hidden="true">
        {en}
      </span>
    </header>
  );
}
