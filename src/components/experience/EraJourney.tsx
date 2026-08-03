import { useCallback, useEffect, useRef, useState } from 'react';

import { createEraScene, type EraSceneHandle, type SceneState } from './eraScene';
import { eras } from '../../data/eras';
import { ArrowRight } from '../Icons';

/**
 * 「業務の進化史」体験コンポーネント。
 *
 * Three.js のシーンを内包し、進む／戻る／フルスクリーンの操作UIを提供する。
 * ページから <EraJourney /> と置くだけで使える。
 */
export default function EraJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<EraSceneHandle | null>(null);

  const [state, setState] = useState<SceneState>({ eraIndex: 0, progress: 0, moving: true });
  const [isFullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);

  /* --- シーンの生成と破棄 --- */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const handle = createEraScene(el, setState);
    sceneRef.current = handle;
    setReady(true);

    const observer = new ResizeObserver(() => handle.resize());
    observer.observe(el);

    return () => {
      observer.disconnect();
      handle.dispose();
      sceneRef.current = null;
    };
  }, []);

  /* --- フルスクリーン --- */
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = wrapRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      /* 端末が非対応の場合は何もしない */
    }
  }, []);

  /* --- キーボード操作 --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') sceneRef.current?.advance();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') sceneRef.current?.back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const era = eras[state.eraIndex];
  const isLast = state.eraIndex === eras.length - 1;
  const isFirst = state.eraIndex === 0;

  return (
    <div className={`journey-wrap${isFullscreen ? ' is-fullscreen' : ''}`} ref={wrapRef}>
      <div className="journey">
        <div className="journey__canvas" ref={canvasRef} aria-hidden="true" />

        {/* --- 進行度 --- */}
        <div className="journey__progress" aria-hidden="true">
          {eras.map((e, i) => (
            <span
              key={e.id}
              className={`journey__tick${i === state.eraIndex ? ' is-active' : ''}${
                i < state.eraIndex ? ' is-passed' : ''
              }`}
            >
              <em>{e.no}</em>
            </span>
          ))}
        </div>

        {/* --- 操作 --- */}
        <div className="journey__controls">
          <button
            type="button"
            className="journey__btn journey__btn--sub"
            onClick={() => sceneRef.current?.back()}
            disabled={isFirst}
            aria-label="前の時代へ戻る"
          >
            戻る
          </button>

          {isLast ? (
            <button
              type="button"
              className="journey__btn journey__btn--main"
              onClick={() => sceneRef.current?.reset()}
            >
              最初から見る
            </button>
          ) : (
            <button
              type="button"
              className="journey__btn journey__btn--main"
              onClick={() => sceneRef.current?.advance()}
            >
              進む
              <ArrowRight className="btn__arrow" />
            </button>
          )}

          <button
            type="button"
            className="journey__btn journey__btn--sub"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? '全画面表示を終了' : '全画面表示にする'}
          >
            {isFullscreen ? '全画面を終了' : '全画面'}
          </button>
        </div>

        <p className="journey__hint" aria-hidden="true">
          マウスを動かすと視点が動きます ／ ← → キーでも移動できます
        </p>

        {!ready && <div className="journey__loading">3D空間を読み込んでいます…</div>}
      </div>

      {/*
        年代・時代名・ひとことは3D空間内の標識に描いてある。
        詳しい説明はここ（キャンバスの外）に置き、3Dの視界を一切覆わないようにしている。
      */}
      <div className="journey-caption" role="status" aria-live="polite">
        <p className="journey-caption__meta">
          <span className="journey-caption__no">{era.no}</span>
          <span className="journey-caption__title">{era.title}</span>
          <span className="journey-caption__years">{era.years}</span>
        </p>
        <p className="journey-caption__desc">{era.description}</p>
        <p className="journey-caption__pain">
          <span>この時代の課題</span>
          {era.pain}
        </p>
      </div>
    </div>
  );
}
