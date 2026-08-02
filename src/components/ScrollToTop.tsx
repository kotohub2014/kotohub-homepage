import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ルート遷移のたびにスクロール位置を先頭へ戻す。
 * ハッシュ付きURL（/services#ai など）はその要素へスクロールする。
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // 遅延読み込みのページでは対象要素がまだ存在しないため、見つかるまで数フレーム待つ
      const id = decodeURIComponent(hash.slice(1));
      let raf = 0;
      const deadline = performance.now() + 2000;

      const tryScroll = () => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        if (performance.now() < deadline) raf = requestAnimationFrame(tryScroll);
      };

      raf = requestAnimationFrame(tryScroll);
      return () => cancelAnimationFrame(raf);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
