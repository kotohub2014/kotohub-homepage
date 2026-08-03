import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  /** 並べる要素。ループさせるため内部で複製する */
  items: ReactNode[];
  /** 自動で流れる速さ（px/秒） */
  speed?: number;
  /** 何セット並べるか。1セットが狭いときは増やす */
  repeat?: number;
  className?: string;
  ariaLabel?: string;
};

/**
 * 横方向に自動で流れ、指やマウスでフリックもできるカルーセル。
 *
 * - 端まで行ったら先頭に戻る無限ループ
 * - ドラッグ／スワイプで手繰れる。離すと慣性で少し流れて自動再開
 * - ホバー中とフォーカス中は自動送りを止めて読めるようにする
 * - `prefers-reduced-motion` では自動送りを行わない
 */
export default function MarqueeCarousel({
  items,
  speed = 42,
  repeat = 3,
  className = '',
  ariaLabel,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  // アニメーションの状態は再描画を挟まないよう ref で持つ
  const offset = useRef(0);
  const velocity = useRef(0);
  const setWidth = useRef(0);
  const dragging = useRef(false);
  const paused = useRef(false);
  const lastX = useRef(0);
  const lastMoveTime = useRef(0);
  const dragDistance = useRef(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const firstSet = setRef.current;
    if (!viewport || !track || !firstSet) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- 1セット分の幅を測る（ループの折り返し幅になる） --- */
    const measure = () => {
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      setWidth.current = firstSet.getBoundingClientRect().width + gap;
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(firstSet);

    /* --- 描画ループ --- */
    let raf = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      if (!dragging.current) {
        if (Math.abs(velocity.current) > 6) {
          // フリック後の慣性
          offset.current += velocity.current * dt;
          velocity.current *= Math.pow(0.0015, dt);
        } else {
          velocity.current = 0;
          if (!paused.current && !reduceMotion) offset.current -= speed * dt;
        }
      }

      // 1セット分ずらすだけで見た目が変わらないので、その範囲に丸めて無限ループにする
      const w = setWidth.current;
      if (w > 0) {
        if (offset.current <= -w) offset.current += w * Math.ceil(-offset.current / w);
        if (offset.current > 0) offset.current -= w * Math.ceil(offset.current / w);
      }

      track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* --- ドラッグ／スワイプ --- */
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      dragging.current = true;
      dragDistance.current = 0;
      velocity.current = 0;
      lastX.current = e.clientX;
      lastMoveTime.current = performance.now();
      viewport.classList.add('is-dragging');
      // 捕捉できない状況（既にポインタが解放されている等）でも
      // ドラッグ自体は続けられるようにする
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch {
        /* 捕捉できなくても pointermove は拾えるため続行 */
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      const now = performance.now();
      const dt = Math.max((now - lastMoveTime.current) / 1000, 0.001);

      offset.current += dx;
      dragDistance.current += Math.abs(dx);
      // 速度は指数移動平均でならす（1フレームの跳ねを拾わないように）
      velocity.current = velocity.current * 0.7 + (dx / dt) * 0.3;

      lastX.current = e.clientX;
      lastMoveTime.current = now;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      viewport.classList.remove('is-dragging');
      try {
        if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
      } catch {
        /* 解放済みなら何もしなくてよい */
      }
      // 指を止めてから離した場合は慣性を付けない
      if (performance.now() - lastMoveTime.current > 120) velocity.current = 0;
    };

    /* ドラッグ直後のクリックでリンクが開かないようにする */
    const onClickCapture = (e: MouseEvent) => {
      if (dragDistance.current > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const pause = () => (paused.current = true);
    const resume = () => (paused.current = false);

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('click', onClickCapture, true);
    viewport.addEventListener('pointerenter', pause);
    viewport.addEventListener('pointerleave', resume);
    viewport.addEventListener('focusin', pause);
    viewport.addEventListener('focusout', resume);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', endDrag);
      viewport.removeEventListener('pointercancel', endDrag);
      viewport.removeEventListener('click', onClickCapture, true);
      viewport.removeEventListener('pointerenter', pause);
      viewport.removeEventListener('pointerleave', resume);
      viewport.removeEventListener('focusin', pause);
      viewport.removeEventListener('focusout', resume);
    };
  }, [speed, items.length]);

  return (
    <div className={`carousel ${className}`.trim()} ref={viewportRef} aria-label={ariaLabel}>
      <div className="carousel__track" ref={trackRef}>
        {Array.from({ length: repeat }, (_, setIndex) => (
          <div
            className="carousel__set"
            key={setIndex}
            ref={setIndex === 0 ? setRef : undefined}
            // 複製分は読み上げの対象から外す
            aria-hidden={setIndex > 0 || undefined}
          >
            {items.map((item, i) => (
              <div className="carousel__item" key={i}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
