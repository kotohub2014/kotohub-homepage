/**
 * 「業務の進化史」体験シーン（Three.js）
 *
 * React に依存しない純粋なモジュールとして実装している。
 * createEraScene() でシーンを組み立て、返り値のハンドルから
 * 前進・後退・破棄を操作する。
 */
import * as THREE from 'three';

import { eras, ZONE_DEPTH, type Era, type EraObjectKind } from '../../data/eras';

export type SceneState = {
  /** 現在いる時代のインデックス */
  eraIndex: number;
  /** 全体の進行度 0〜1 */
  progress: number;
  /** 移動中かどうか */
  moving: boolean;
};

export type EraSceneHandle = {
  advance: () => void;
  back: () => void;
  reset: () => void;
  resize: () => void;
  dispose: () => void;
};

/** 目的地に向かって指数的に減衰しながら近づく（フレームレート非依存） */
function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/* ------------------------------------------------------------------ *
 * テキストを描いたスプライトを作る
 * ------------------------------------------------------------------ */

function createTextSprite(text: string, color: number, subText?: string) {
  const canvas = document.createElement('canvas');
  const scale = 2;
  canvas.width = 1024 * scale;
  canvas.height = 256 * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const hex = `#${color.toString(16).padStart(6, '0')}`;
  ctx.shadowColor = hex;
  ctx.shadowBlur = 24;
  ctx.fillStyle = hex;
  ctx.font =
    '600 62px "Noto Sans JP", -apple-system, "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif';
  ctx.fillText(text, 512, subText ? 100 : 128);

  if (subText) {
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.75;
    ctx.font = '400 30px "Inter", sans-serif';
    ctx.fillText(subText, 512, 168);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(60, 15, 1);
  return { sprite, redraw: () => (texture.needsUpdate = true) };
}

/**
 * 時代名を大きく強調して見せるスプライト。
 * 画面の狭いスマホでは、看板の代わりにこれだけを画面中央に出す。
 */
function createEraTitleSprite(title: string, color: number) {
  const W = 1024;
  const H = 260;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d')!;

  const draw = () => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 長い時代名でも収まるよう字の大きさを詰める
    let size = 104;
    do {
      ctx.font = `700 ${size}px ${JP_FONT}`;
      if (ctx.measureText(title).width <= W - 80) break;
      size -= 6;
    } while (size > 56);

    const hex = `#${color.toString(16).padStart(6, '0')}`;
    // 発光を二重に掛けて、背景が明るくても沈まないようにする
    ctx.shadowColor = hex;
    ctx.shadowBlur = 44;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(title, W / 2, H / 2);
    ctx.shadowBlur = 16;
    ctx.fillText(title, W / 2, H / 2);
  };

  draw();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    // 手前の浮遊オブジェクトに隠されず、常に読める状態にしておく
    depthTest: false,
    fog: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(30, 7.6, 1);
  sprite.renderOrder = 10;
  return {
    sprite,
    redraw: () => {
      draw();
      texture.needsUpdate = true;
    },
  };
}

/* ------------------------------------------------------------------ *
 * 時代の「標識」を3D空間内に作る
 * ------------------------------------------------------------------ */

const JP_FONT = '"Noto Sans JP", -apple-system, "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif';

/**
 * 3D空間内に立てる「時代の標識」。
 *
 * 長い説明文までここに入れると、読める字の大きさにした時点で
 * 画面の6割以上を覆ってしまい、3D空間が見えなくなる。
 * そのため看板には年代・時代名・ひとことだけを載せ、
 * 詳しい説明はキャンバスの外（下）に置いている。
 */
function createInfoPanel(era: Era, planeW: number, planeH: number) {
  const W = 1000;
  const H = 480;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d')!;

  const primaryHex = `#${era.colors.primary.toString(16).padStart(6, '0')}`;
  const goldHex = '#d4af37';

  const draw = () => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // 背景（左端にアクセントの縦ライン）
    const bg = ctx.createLinearGradient(0, 0, W, 0);
    bg.addColorStop(0, 'rgba(6, 6, 12, 0.94)');
    bg.addColorStop(1, 'rgba(6, 6, 12, 0.78)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = goldHex;
    ctx.fillRect(0, 0, 10, H);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    const padX = 64;
    let y = 96;

    // 年代
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = goldHex;
    ctx.font = `700 32px "Inter", ${JP_FONT}`;
    ctx.letterSpacing = '10px';
    ctx.fillText(era.years, padX, y);
    ctx.letterSpacing = '0px';

    // 時代名
    y += 100;
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 78px ${JP_FONT}`;
    ctx.fillText(era.title, padX, y);

    // 英字
    y += 54;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.font = '600 26px "Inter", sans-serif';
    ctx.letterSpacing = '7px';
    ctx.fillText(era.titleEn, padX, y);
    ctx.letterSpacing = '0px';

    // 区切り線
    y += 48;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX, y);
    ctx.lineTo(W - padX, y);
    ctx.stroke();

    // ひとこと
    y += 68;
    ctx.fillStyle = primaryHex;
    ctx.font = `500 46px ${JP_FONT}`;
    ctx.fillText(era.floatText, padX, y);
  };

  draw();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const geometry = new THREE.PlaneGeometry(planeW, planeH);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    fog: false, // 距離で霞むと読めなくなるため霧の影響を受けさせない
  });

  const mesh = new THREE.Mesh(geometry, material);
  return {
    mesh,
    geometry,
    material,
    redraw: () => {
      draw();
      texture.needsUpdate = true;
    },
  };
}

/* ------------------------------------------------------------------ *
 * 時代ごとの浮遊オブジェクト
 * すべてフラットシェーディングのミドルポリゴンで統一している
 * ------------------------------------------------------------------ */

type Shared = {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
};

function track<T extends THREE.BufferGeometry>(shared: Shared, g: T): T {
  shared.geometries.push(g);
  return g;
}
function trackMat<T extends THREE.Material>(shared: Shared, m: T): T {
  shared.materials.push(m);
  return m;
}

function solidMat(shared: Shared, color: number, opts: { emissive?: number; opacity?: number } = {}) {
  return trackMat(
    shared,
    new THREE.MeshStandardMaterial({
      color,
      flatShading: true,
      roughness: 0.45,
      metalness: 0.35,
      emissive: opts.emissive ?? 0x000000,
      emissiveIntensity: 0.6,
      transparent: opts.opacity !== undefined,
      opacity: opts.opacity ?? 1,
    }),
  );
}

function lineMat(shared: Shared, color: number, opacity = 0.5) {
  return trackMat(shared, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}

function buildObject(kind: EraObjectKind, era: Era, shared: Shared): THREE.Object3D {
  const { primary, accent } = era.colors;
  const group = new THREE.Group();

  switch (kind) {
    case 'paper': {
      // A4のような縦長の書類。厚みを持たせてシルエットをはっきりさせる
      const sheet = track(shared, new THREE.BoxGeometry(9, 12.5, 0.25));
      const mat = trackMat(
        shared,
        new THREE.MeshStandardMaterial({
          color: 0xf3ead2,
          flatShading: true,
          roughness: 0.85,
          metalness: 0,
          emissive: primary,
          emissiveIntensity: 0.18,
        }),
      );
      group.add(new THREE.Mesh(sheet, mat));

      // 本文の罫線と、見出しの帯
      const head = track(shared, new THREE.BoxGeometry(5.4, 0.9, 0.1));
      const headMesh = new THREE.Mesh(head, solidMat(shared, accent));
      headMesh.position.set(-1.4, 4.8, 0.18);
      group.add(headMesh);

      const rule = track(shared, new THREE.BoxGeometry(6.8, 0.28, 0.08));
      const ruleMat = solidMat(shared, accent, { opacity: 0.75 });
      for (let i = 0; i < 8; i++) {
        const r = new THREE.Mesh(rule, ruleMat);
        r.position.set(-0.6, 3 - i * 1.15, 0.18);
        r.scale.x = i % 3 === 2 ? 0.62 : 1;
        group.add(r);
      }
      break;
    }

    case 'pencil': {
      // 六角形の軸＋木部＋芯＋金具＋消しゴム。鉛筆とすぐ分かる構成にする
      const body = track(shared, new THREE.CylinderGeometry(0.75, 0.75, 12, 6));
      group.add(new THREE.Mesh(body, solidMat(shared, 0xe8b93f)));

      const wood = track(shared, new THREE.ConeGeometry(0.75, 2, 6));
      const woodMesh = new THREE.Mesh(wood, solidMat(shared, 0xe6d2a8));
      woodMesh.position.y = -7;
      woodMesh.rotation.y = Math.PI / 6;
      group.add(woodMesh);

      const lead = track(shared, new THREE.ConeGeometry(0.28, 0.9, 6));
      const leadMesh = new THREE.Mesh(lead, solidMat(shared, 0x2b2b2b));
      leadMesh.position.y = -8.4;
      group.add(leadMesh);

      const ferrule = track(shared, new THREE.CylinderGeometry(0.8, 0.8, 1.2, 6));
      const ferruleMesh = new THREE.Mesh(ferrule, solidMat(shared, 0xb9c0c7));
      ferruleMesh.position.y = 6.5;
      group.add(ferruleMesh);

      const eraser = track(shared, new THREE.CylinderGeometry(0.78, 0.78, 1.4, 6));
      const eraserMesh = new THREE.Mesh(eraser, solidMat(shared, 0xe08b8b));
      eraserMesh.position.y = 7.7;
      group.add(eraserMesh);
      break;
    }

    case 'calculator': {
      // 正面を向いた電卓。液晶とボタンを手前に出して形を読みやすくする
      const body = track(shared, new THREE.BoxGeometry(8, 11, 1.6));
      group.add(new THREE.Mesh(body, solidMat(shared, 0x2e3a34)));

      const edge = track(shared, new THREE.EdgesGeometry(body));
      group.add(new THREE.LineSegments(edge, lineMat(shared, primary, 0.5)));

      // 液晶
      const screen = track(shared, new THREE.BoxGeometry(6.4, 2.4, 0.3));
      const screenMesh = new THREE.Mesh(screen, solidMat(shared, primary, { emissive: primary }));
      screenMesh.position.set(0, 3.6, 0.9);
      group.add(screenMesh);

      // ボタン（4×4）
      const btn = track(shared, new THREE.BoxGeometry(1.3, 1.1, 0.45));
      const btnMat = solidMat(shared, 0x7f8c86);
      const accentBtnMat = solidMat(shared, accent, { emissive: accent });
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const b = new THREE.Mesh(btn, c === 3 ? accentBtnMat : btnMat);
          b.position.set(-2.4 + c * 1.6, 0.9 - r * 1.5, 0.9);
          group.add(b);
        }
      }
      break;
    }

    case 'grid': {
      // 表計算シート。背景板＋見出し行＋セルで「表」だと一目で分かるようにする
      const w = 14;
      const h = 10;
      const cols = 6;
      const rows = 5;

      const board = track(shared, new THREE.BoxGeometry(w, h, 0.3));
      group.add(new THREE.Mesh(board, solidMat(shared, 0x16241d)));

      // 見出し行
      const header = track(shared, new THREE.BoxGeometry(w, h / rows, 0.2));
      const headerMesh = new THREE.Mesh(header, solidMat(shared, accent, { emissive: accent }));
      headerMesh.position.set(0, h / 2 - h / rows / 2, 0.2);
      group.add(headerMesh);

      // セルを敷き詰める
      const cell = track(shared, new THREE.BoxGeometry(w / cols - 0.35, h / rows - 0.3, 0.14));
      const cellMat = solidMat(shared, 0x2c463a);
      const litMat = solidMat(shared, primary, { emissive: primary });
      for (let r = 1; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lit = (r * cols + c) % 7 === 3;
          const m = new THREE.Mesh(cell, lit ? litMat : cellMat);
          m.position.set(-w / 2 + (w / cols) * (c + 0.5), h / 2 - (h / rows) * (r + 0.5), 0.2);
          group.add(m);
        }
      }

      const edge = track(shared, new THREE.EdgesGeometry(board));
      group.add(new THREE.LineSegments(edge, lineMat(shared, primary, 0.55)));
      break;
    }

    case 'monitor': {
      // デスクトップPCのモニタ。台座と首を付けて形をはっきりさせる
      const frame = track(shared, new THREE.BoxGeometry(15, 10, 0.9));
      group.add(new THREE.Mesh(frame, solidMat(shared, 0x1d2635)));

      const screen = track(shared, new THREE.BoxGeometry(13.6, 8.4, 0.2));
      const screenMesh = new THREE.Mesh(screen, solidMat(shared, primary, { emissive: primary }));
      screenMesh.position.z = 0.6;
      group.add(screenMesh);

      // 画面の中のウィンドウらしき矩形
      const inner = track(shared, new THREE.BoxGeometry(5.6, 3.4, 0.12));
      const innerMat = solidMat(shared, 0x0d1524);
      const a = new THREE.Mesh(inner, innerMat);
      a.position.set(-3.4, 1.6, 0.75);
      group.add(a);
      const b = new THREE.Mesh(inner, innerMat);
      b.position.set(3.2, -1.8, 0.75);
      b.scale.set(0.8, 0.7, 1);
      group.add(b);

      const neck = track(shared, new THREE.BoxGeometry(1.6, 3.2, 1.2));
      const neckMesh = new THREE.Mesh(neck, solidMat(shared, 0x1d2635));
      neckMesh.position.y = -6.4;
      group.add(neckMesh);

      const base = track(shared, new THREE.BoxGeometry(7, 0.7, 3.4));
      const baseMesh = new THREE.Mesh(base, solidMat(shared, 0x1d2635));
      baseMesh.position.y = -8.2;
      group.add(baseMesh);

      const edge = track(shared, new THREE.EdgesGeometry(frame));
      group.add(new THREE.LineSegments(edge, lineMat(shared, primary, 0.6)));
      break;
    }

    case 'window': {
      // アプリのウィンドウ。タイトルバーの信号ボタンで一目で分かるように
      const body = track(shared, new THREE.BoxGeometry(12, 8.5, 0.4));
      group.add(new THREE.Mesh(body, solidMat(shared, 0x16203a, { opacity: 0.92 })));

      const bar = track(shared, new THREE.BoxGeometry(12, 1.5, 0.5));
      const barMesh = new THREE.Mesh(bar, solidMat(shared, 0x2c3f66));
      barMesh.position.y = 3.5;
      group.add(barMesh);

      // 信号ボタン
      const dot = track(shared, new THREE.SphereGeometry(0.34, 8, 6));
      [0xff6b6b, 0xffd166, 0x6bd38a].forEach((c, i) => {
        const d = new THREE.Mesh(dot, solidMat(shared, c, { emissive: c }));
        d.position.set(-5.2 + i * 1, 3.5, 0.35);
        group.add(d);
      });

      // 中身のコンテンツ行
      const row = track(shared, new THREE.BoxGeometry(8.6, 0.7, 0.14));
      const rowMat = solidMat(shared, primary, { emissive: primary, opacity: 0.85 });
      for (let i = 0; i < 4; i++) {
        const r = new THREE.Mesh(row, rowMat);
        r.position.set(-0.8, 1.6 - i * 1.5, 0.28);
        r.scale.x = [1, 0.72, 0.9, 0.55][i];
        group.add(r);
      }

      const edge = track(shared, new THREE.EdgesGeometry(body));
      group.add(new THREE.LineSegments(edge, lineMat(shared, primary, 0.7)));
      break;
    }

    case 'cloud': {
      // 平らな底面＋盛り上がった上面で、絵文字のような分かりやすい雲の形に
      const mat = trackMat(
        shared,
        new THREE.MeshStandardMaterial({
          color: 0xf2fdff,
          flatShading: true,
          roughness: 0.85,
          metalness: 0.05,
          emissive: primary,
          emissiveIntensity: 0.3,
        }),
      );
      const blobs: [number, number, number, number][] = [
        [0, 0.6, 0, 4.4],
        [4.6, -0.6, 0, 3.2],
        [-4.6, -0.6, 0, 3.2],
        [2.2, 2.4, 0, 2.8],
        [-2.2, 2.2, 0, 2.5],
        [7.8, -1.6, 0, 2.1],
        [-7.8, -1.6, 0, 2.1],
      ];
      for (const [x, y, z, r] of blobs) {
        const geo = track(shared, new THREE.IcosahedronGeometry(r, 1));
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        m.scale.y = 0.85;
        group.add(m);
      }
      break;
    }

    case 'server': {
      // サーバーラック。前面パネルとLEDを並べて「機械」らしさを出す
      const rack = track(shared, new THREE.BoxGeometry(7, 14, 5));
      group.add(new THREE.Mesh(rack, solidMat(shared, 0x1a2b2e)));

      const unit = track(shared, new THREE.BoxGeometry(6.2, 1.5, 0.4));
      const unitMat = solidMat(shared, 0x2f4a4f);
      const led = track(shared, new THREE.BoxGeometry(0.4, 0.4, 0.2));
      const ledMat = solidMat(shared, primary, { emissive: primary });

      for (let i = 0; i < 7; i++) {
        const y = 5.4 - i * 1.8;
        const u = new THREE.Mesh(unit, unitMat);
        u.position.set(0, y, 2.55);
        group.add(u);
        for (let k = 0; k < 3; k++) {
          const l = new THREE.Mesh(led, ledMat);
          l.position.set(-2.3 + k * 0.7, y, 2.8);
          group.add(l);
        }
      }

      const edge = track(shared, new THREE.EdgesGeometry(rack));
      group.add(new THREE.LineSegments(edge, lineMat(shared, primary, 0.45)));
      break;
    }

    case 'frame': {
      // 建設中の骨組み。まだ中身が入っていない「これから作る」構造体
      const size = 7;
      const box = track(shared, new THREE.BoxGeometry(size, size, size));
      const edge = track(shared, new THREE.EdgesGeometry(box));
      group.add(new THREE.LineSegments(edge, lineMat(shared, primary, 0.9)));

      // 角のジョイント
      const joint = track(shared, new THREE.BoxGeometry(0.7, 0.7, 0.7));
      const jointMat = solidMat(shared, accent, { emissive: accent });
      const h = size / 2;
      for (const sx of [-h, h]) {
        for (const sy of [-h, h]) {
          for (const sz of [-h, h]) {
            const j = new THREE.Mesh(joint, jointMat);
            j.position.set(sx, sy, sz);
            group.add(j);
          }
        }
      }

      // 組み上がった一部だけを実体化させる
      const filled = track(shared, new THREE.BoxGeometry(size / 2, size / 2, size / 2));
      const filledMesh = new THREE.Mesh(
        filled,
        trackMat(
          shared,
          new THREE.MeshStandardMaterial({
            color: primary,
            flatShading: true,
            transparent: true,
            opacity: 0.28,
            roughness: 0.3,
            metalness: 0.7,
          }),
        ),
      );
      filledMesh.position.set(-size / 4, -size / 4, -size / 4);
      group.add(filledMesh);
      break;
    }

    case 'spark': {
      // 光の核とそれを取り巻くリング。次の時代の種
      const core = track(shared, new THREE.IcosahedronGeometry(2.2, 1));
      group.add(
        new THREE.Mesh(
          core,
          trackMat(
            shared,
            new THREE.MeshStandardMaterial({
              color: 0xffffff,
              flatShading: true,
              emissive: 0xffffff,
              emissiveIntensity: 0.9,
              roughness: 0.2,
              metalness: 0.4,
            }),
          ),
        ),
      );

      const ringMat = trackMat(
        shared,
        new THREE.MeshBasicMaterial({
          color: accent,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      const tilts: [number, number][] = [
        [Math.PI / 2, 0],
        [Math.PI / 3, Math.PI / 4],
        [Math.PI / 2.2, -Math.PI / 3],
      ];
      tilts.forEach(([rx, ry], i) => {
        const ring = track(shared, new THREE.TorusGeometry(4.4 + i * 1.4, 0.14, 6, 40));
        const m = new THREE.Mesh(ring, ringMat);
        m.rotation.set(rx, ry, 0);
        group.add(m);
      });
      break;
    }

    case 'node': {
      // 中心のコアと、放射状につながるノード
      const core = track(shared, new THREE.IcosahedronGeometry(1.8, 1));
      group.add(new THREE.Mesh(core, solidMat(shared, primary, { emissive: primary })));

      const satGeo = track(shared, new THREE.IcosahedronGeometry(0.7, 0));
      const satMat = solidMat(shared, accent, { emissive: accent });
      const linePts: number[] = [];
      const count = 7;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const r = 6 + (i % 3) * 1.8;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.7;
        const z = Math.sin(a * 2) * 2.5;
        const s = new THREE.Mesh(satGeo, satMat);
        s.position.set(x, y, z);
        group.add(s);
        linePts.push(0, 0, 0, x, y, z);
      }
      const lineGeo = track(shared, new THREE.BufferGeometry());
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
      group.add(new THREE.LineSegments(lineGeo, lineMat(shared, primary, 0.45)));
      break;
    }

    case 'shard': {
      const geo = track(shared, new THREE.OctahedronGeometry(3.4, 0));
      group.add(
        new THREE.Mesh(
          geo,
          trackMat(
            shared,
            new THREE.MeshStandardMaterial({
              color: primary,
              flatShading: true,
              roughness: 0.15,
              metalness: 0.9,
              emissive: era.colors.accent,
              emissiveIntensity: 0.35,
            }),
          ),
        ),
      );
      const edge = track(shared, new THREE.EdgesGeometry(geo));
      group.add(new THREE.LineSegments(edge, lineMat(shared, 0xffffff, 0.6)));
      break;
    }
  }

  return group;
}

/* ------------------------------------------------------------------ *
 * シーン本体
 * ------------------------------------------------------------------ */

type FloatingItem = {
  object: THREE.Object3D;
  /** 揺れの基準位置 */
  baseY: number;
  phase: number;
  bob: number;
  spin: THREE.Vector3;
};

export function createEraScene(
  container: HTMLElement,
  onState: (state: SceneState) => void,
): EraSceneHandle {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** 画面が小さい端末は描画負荷を抑える */
  const isCompact = window.innerWidth < 860;

  /* --- レンダラー --- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCompact ? 1.5 : 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const fog = new THREE.FogExp2(eras[0].colors.fog, 0.0075);
  scene.fog = fog;
  scene.background = new THREE.Color(eras[0].colors.fog);

  // far は霧で見えなくなる距離に合わせる。
  // 遠方のゾーンが視錐台カリングで除外され、描画コールを大きく減らせる
  const camera = new THREE.PerspectiveCamera(
    68,
    container.clientWidth / container.clientHeight,
    0.1,
    320,
  );
  camera.position.set(0, 6, 20);

  /* --- ライト --- */
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);
  const keyLight = new THREE.PointLight(eras[0].colors.primary, 400, 260, 2);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
  rimLight.position.set(-1, 1, 1);
  scene.add(rimLight);

  const shared: Shared = { geometries: [], materials: [] };
  const floating: FloatingItem[] = [];

  /* --- 床と天井のグリッド --- */
  const corridorLength = eras.length * ZONE_DEPTH;
  const gridMat = trackMat(
    shared,
    new THREE.LineBasicMaterial({ color: eras[0].colors.primary, transparent: true, opacity: 0.22 }),
  );
  const buildGrid = (y: number) => {
    const geo = track(shared, new THREE.BufferGeometry());
    const pts: number[] = [];
    const half = 90;
    for (let x = -half; x <= half; x += 15) pts.push(x, y, 40, x, y, -corridorLength - 40);
    for (let z = 40; z >= -corridorLength - 40; z -= 15) pts.push(-half, y, z, half, y, z);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(geo, gridMat);
  };
  scene.add(buildGrid(-14));
  scene.add(buildGrid(34));

  /* --- 漂う塵（奥行き感） --- */
  const dustGeo = track(shared, new THREE.BufferGeometry());
  const dustCount = isCompact ? 400 : 900;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 170;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 60 + 8;
    dustPos[i * 3 + 2] = 40 - Math.random() * (corridorLength + 80);
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = trackMat(
    shared,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.55,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(new THREE.Points(dustGeo, dustMat));

  /* --- カメラが各時代で停まる位置 --- */
  const zoneZ = (i: number) => -(i * ZONE_DEPTH + ZONE_DEPTH / 2) + 34;

  /* --- 標識の配置。画面比率に応じて調整する ---
     横長の画面では通路の左脇に看板を置く。
     縦長（スマホ）は横幅が足りず看板が他の要素と重なってしまうため、
     看板は出さずに時代名だけを画面中央へ大きく表示する。
     パネルの縦横比は 1000:480 = 2.083 に合わせる */
  const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
  const isPortrait = aspect < 1.0;
  const panelLayout =
    aspect >= 1.4
      ? { w: 34, h: 16.3, x: -27, y: 6, dz: 42 }
      : { w: 29, h: 13.9, x: -19, y: 6, dz: 46 };

  /* --- 各時代のゾーンを組み立てる --- */
  /** 1ゾーンあたりの配置数。種類は era.objects を巡回して使う */
  // オブジェクト1つあたりのメッシュ数が増えたため、配置数は絞って描画コールを抑える
  const PER_ZONE = isCompact ? 5 : 9;

  /** フォント読み込み後に描き直す必要があるテキスト類 */
  const redraws: (() => void)[] = [];

  eras.forEach((era, ei) => {
    const zoneCenter = -(ei * ZONE_DEPTH + ZONE_DEPTH / 2);
    const stopZ = zoneZ(ei);
    const panelZ = stopZ - panelLayout.dz;

    for (let oi = 0; oi < PER_ZONE; oi++) {
      const kind = era.objects[oi % era.objects.length];
      const obj = buildObject(kind, era, shared);

      // 通路の左右に振り分けつつ、高さと奥行きをばらす。
      // 手前ほど近く、奥ほど遠くに置いて視界の抜けを作る
      let side = oi % 2 === 0 ? -1 : 1;
      const z = zoneCenter + (oi / (PER_ZONE - 1) - 0.5) * (ZONE_DEPTH - 12);

      // 説明パネルと重なる位置に来るオブジェクトは反対側へ逃がす
      // （パネルを出さないスマホでは不要）
      if (!isPortrait && side === -1 && Math.abs(z - panelZ) < 30) side = 1;

      const x = side * (20 + ((oi * 13) % 4) * 12 + Math.random() * 6);
      const y = -8 + ((oi * 11) % 30) + Math.random() * 4;

      obj.position.set(x, y, z);

      // 通路の中央（＝カメラ側）へ正面を向ける。
      // ランダムに回すと何の物体か読み取れないため、傾きは控えめにする
      obj.rotation.set(
        (Math.random() - 0.5) * 0.18,
        -side * (0.5 + Math.random() * 0.25),
        (Math.random() - 0.5) * 0.14,
      );

      const s = 1 + Math.random() * 0.35;
      obj.scale.setScalar(s);
      scene.add(obj);

      floating.push({
        object: obj,
        baseY: y,
        phase: Math.random() * Math.PI * 2,
        bob: 1.2 + Math.random() * 1.8,
        // 形が読み取れなくならないよう、Y軸まわりにごく緩やかに揺らすだけにする
        spin: new THREE.Vector3(0, (Math.random() - 0.5) * 0.035, 0),
      });
    }

    if (isPortrait) {
      // スマホ：時代名だけを画面中央に大きく出す
      const { sprite, redraw } = createEraTitleSprite(era.title, era.colors.primary);
      const baseY = 7;
      sprite.position.set(0, baseY, stopZ - 46);
      scene.add(sprite);
      shared.materials.push(sprite.material);
      redraws.push(redraw);

      floating.push({
        object: sprite,
        baseY,
        phase: Math.random() * Math.PI * 2,
        bob: 0.5, // 読みづらくならないよう、揺れはごく小さく
        spin: new THREE.Vector3(0, 0, 0),
      });
    } else {
      // 空間に浮かぶ短いコピー（通路の奥、頭上に大きく）
      const { sprite, redraw: redrawSprite } = createTextSprite(
        era.floatText,
        era.colors.primary,
        era.titleEn,
      );
      sprite.position.set(0, 17, zoneCenter - 26);
      scene.add(sprite);
      // テクスチャは dispose() 側の traverse でまとめて解放する
      shared.materials.push(sprite.material);
      redraws.push(redrawSprite);

      floating.push({
        object: sprite,
        baseY: 17,
        phase: Math.random() * Math.PI * 2,
        bob: 1.4,
        spin: new THREE.Vector3(0, 0, 0),
      });

      // 時代の説明パネル。オーバーレイではなく3D空間の中に立てる
      const panel = createInfoPanel(era, panelLayout.w, panelLayout.h);
      panel.mesh.position.set(panelLayout.x, panelLayout.y, panelZ);
      // カメラが停まる位置をまっすぐ向かせて、正対した状態で読めるようにする
      panel.mesh.lookAt(new THREE.Vector3(0, 6, stopZ));
      scene.add(panel.mesh);

      shared.geometries.push(panel.mesh.geometry);
      shared.materials.push(panel.material);
      redraws.push(panel.redraw);

      floating.push({
        object: panel.mesh,
        baseY: panelLayout.y,
        phase: Math.random() * Math.PI * 2,
        bob: 0.45, // 読みづらくならないよう、揺れはごく小さく
        spin: new THREE.Vector3(0, 0, 0),
      });
    }
  });

  /* --- Webフォントの読み込みが終わってから描き直す ---
     初回描画時にNoto Sans JPが未読込だと代替フォントで焼き付いてしまうため */
  document.fonts?.ready
    .then(() => {
      for (const r of redraws) r();
    })
    .catch(() => {
      /* 対応していない環境では初回描画のまま */
    });

  /* --- 通路の終端。行き止まりに見せず「この先へ続く」印象にする --- */
  const gateColor = eras[eras.length - 1].colors.primary;
  const gateGroup = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const r = 26 + i * 9;
    const ring = track(shared, new THREE.TorusGeometry(r, 0.35, 6, 48));
    const mesh = new THREE.Mesh(
      ring,
      trackMat(
        shared,
        new THREE.MeshBasicMaterial({
          color: gateColor,
          transparent: true,
          opacity: 0.5 - i * 0.08,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
    mesh.position.z = -corridorLength - i * 22;
    gateGroup.add(mesh);
    floating.push({
      object: mesh,
      baseY: 8,
      phase: i * 0.7,
      bob: 0.8,
      spin: new THREE.Vector3(0, 0, 0.05 + i * 0.02),
    });
  }
  scene.add(gateGroup);

  /* --- 状態 --- */
  let eraIndex = 0;
  let targetZ = camera.position.z;
  let disposed = false;
  let moving = false;

  const pointer = { x: 0, y: 0 };
  const look = { x: 0, y: 0 };

  const emit = () => {
    onState({
      eraIndex,
      progress: eras.length > 1 ? eraIndex / (eras.length - 1) : 1,
      moving,
    });
  };

  const goTo = (i: number) => {
    eraIndex = THREE.MathUtils.clamp(i, 0, eras.length - 1);
    targetZ = zoneZ(eraIndex);
    moving = true;
    emit();
  };

  /* --- 入力 --- */
  const onPointerMove = (e: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  };
  container.addEventListener('pointermove', onPointerMove);

  /* --- 描画ループ --- */
  // THREE.Clock は非推奨のため、標準APIで経過時間を管理する
  const startTime = performance.now();
  let lastTime = startTime;
  const fogColor = new THREE.Color(eras[0].colors.fog);
  const lightColor = new THREE.Color(eras[0].colors.primary);
  let raf = 0;

  const render = () => {
    if (disposed) return;
    raf = requestAnimationFrame(render);

    const now = performance.now();
    // タブが非表示だった間の巨大なdtでカメラが飛ばないよう上限を設ける
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const t = (now - startTime) / 1000;

    /* カメラ：目的地へすっと滑り込む */
    camera.position.z = damp(camera.position.z, targetZ, 1.6, dt);
    if (moving && Math.abs(camera.position.z - targetZ) < 0.6) {
      moving = false;
      emit();
    }

    /* 視点：ポインタにわずかに追従（FPSらしい首振り） */
    look.x = damp(look.x, pointer.x * 0.16, 3, dt);
    look.y = damp(look.y, -pointer.y * 0.1, 3, dt);
    camera.rotation.set(look.y, -look.x, 0, 'YXZ');

    /* 歩行のような上下動 */
    camera.position.y = 6 + Math.sin(t * 0.9) * (reduceMotion ? 0 : 0.5);
    camera.position.x = Math.sin(t * 0.45) * (reduceMotion ? 0 : 1.2);

    /* いまどの時代の色か（境目でなめらかに混ぜる） */
    const raw = THREE.MathUtils.clamp(
      (-camera.position.z + 34 - ZONE_DEPTH / 2) / ZONE_DEPTH,
      0,
      eras.length - 1,
    );
    const lo = Math.floor(raw);
    const hi = Math.min(lo + 1, eras.length - 1);
    const mix = raw - lo;

    fogColor.set(eras[lo].colors.fog).lerp(new THREE.Color(eras[hi].colors.fog), mix);
    fog.color.copy(fogColor);
    (scene.background as THREE.Color).copy(fogColor);

    lightColor.set(eras[lo].colors.primary).lerp(new THREE.Color(eras[hi].colors.primary), mix);
    keyLight.color.copy(lightColor);
    keyLight.position.set(0, 16, camera.position.z - 30);
    gridMat.color.copy(lightColor);

    /* 物体をふわふわ浮遊させる */
    if (!reduceMotion) {
      for (const f of floating) {
        f.object.position.y = f.baseY + Math.sin(t * 0.6 + f.phase) * f.bob;
        f.object.rotation.x += f.spin.x * dt;
        f.object.rotation.y += f.spin.y * dt;
        f.object.rotation.z += f.spin.z * dt;
      }
    }

    renderer.render(scene, camera);
  };

  /* --- リサイズ --- */
  const resize = () => {
    if (disposed) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  /* --- 破棄 --- */
  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(raf);
    container.removeEventListener('pointermove', onPointerMove);

    scene.traverse((o) => {
      if (o instanceof THREE.Sprite) o.material.map?.dispose();
    });
    for (const g of shared.geometries) g.dispose();
    for (const m of shared.materials) m.dispose();
    dustGeo.dispose();

    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  goTo(0);
  render();

  return {
    advance: () => goTo(eraIndex + 1),
    back: () => goTo(eraIndex - 1),
    reset: () => goTo(0),
    resize,
    dispose,
  };
}
