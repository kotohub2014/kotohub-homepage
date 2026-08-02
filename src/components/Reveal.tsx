import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** 表示開始までの遅延（秒） */
  delay?: number;
  className?: string;
  as?: ElementType;
  id?: string;
};

/**
 * スクロールで一度だけフェードインさせるラッパー。
 * IntersectionObserver で `is-visible` を付与するだけの軽量実装。
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div', id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
