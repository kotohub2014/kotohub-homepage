import { useCallback, type MouseEvent, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * カーソル位置を CSS 変数(--mx / --my)に渡して、
 * カード内にスポットライトを追従させるカード。
 */
export default function SpotlightCard({ children, className = '' }: Props) {
  const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div className={`card ${className}`.trim()} onMouseMove={onMouseMove}>
      {children}
    </div>
  );
}
