import { useState } from 'react';
import { founder } from '../data/content';

/** 顔写真が未配置／読み込み失敗の場合は金の円形フレームにフォールバックする */
export default function FounderPhoto({ className = '' }: { className?: string }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={`founder-photo ${className}`.trim()}>
      <div className="founder-photo__inner">
        {broken ? (
          <span className="founder-photo__fallback gold-text">智</span>
        ) : (
          <img src={founder.photo} alt={founder.name} onError={() => setBroken(true)} />
        )}
      </div>
    </div>
  );
}
