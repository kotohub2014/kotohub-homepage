/**
 * 体験コーナー「業務の進化史」で使う時代データ。
 *
 * 各ゾーンは 3D 空間の Z 軸上に等間隔で並び、カメラが手前から奥へ進むにつれて
 * 配色・浮遊オブジェクト・説明文が切り替わる。
 */

export type EraObjectKind =
  | 'paper' // 紙・書類
  | 'pencil' // 鉛筆
  | 'calculator' // 電卓
  | 'grid' // 表計算のセル
  | 'monitor' // モニタ
  | 'window' // アプリのウィンドウ
  | 'cloud' // 雲
  | 'server' // サーバー
  | 'node' // ニューラルネットのノード
  | 'shard' // 結晶（AI）
  | 'frame' // 建設中のワイヤーフレーム（未来）
  | 'spark'; // 光の核とリング（未来）

export type Era = {
  id: string;
  no: string;
  /** 見出し（例: 紙と鉛筆の時代） */
  title: string;
  titleEn: string;
  years: string;
  /** 3D空間に浮かぶ短いコピー */
  floatText: string;
  /** オーバーレイに出す説明文 */
  description: string;
  /** その時代の「つらさ」 */
  pain: string;
  /** 配色（16進数）: 主役色 / 補助色 / 霧の色 */
  colors: { primary: number; accent: number; fog: number };
  /** このゾーンに配置する物体の種類 */
  objects: EraObjectKind[];
};

export const eras: Era[] = [
  {
    id: 'paper',
    no: '01',
    title: '紙と鉛筆の時代',
    titleEn: 'PAPER & PENCIL',
    years: '〜1970s',
    floatText: 'すべては、手書きだった。',
    description:
      '台帳も、伝票も、計算も、すべて人の手で。情報は紙の上にしか存在せず、探すことも、共有することも、書き写すことも、ぜんぶ人の時間を使っていました。',
    pain: '転記ミス／探せない／共有できない',
    colors: { primary: 0xd8c49a, accent: 0x8c6a1e, fog: 0x141009 },
    objects: ['paper', 'pencil', 'paper', 'paper', 'pencil'],
  },
  {
    id: 'calc',
    no: '02',
    title: '電卓と表計算の時代',
    titleEn: 'CALCULATOR & SPREADSHEET',
    years: '1980s〜',
    floatText: '計算が、速くなった。',
    description:
      '電卓が計算を、表計算ソフトが集計を引き受けました。数字を扱う速度は劇的に上がりましたが、ファイルは個人のPCの中。「最新版はどれ？」という新しい問題が生まれます。',
    pain: 'ファイルが散在／属人化／版がわからない',
    colors: { primary: 0x7fd8a8, accent: 0x2f8f5f, fog: 0x08140e },
    objects: ['calculator', 'grid', 'grid', 'calculator', 'grid'],
  },
  {
    id: 'app',
    no: '03',
    title: 'PCとアプリの時代',
    titleEn: 'PC & APPLICATION',
    years: '1990s〜',
    floatText: '仕事が、画面の中へ。',
    description:
      '業務システムが登場し、仕事はアプリケーションの中で完結するようになりました。一方でシステムごとにデータが分かれ、つなぐための手作業がまた増えていきます。',
    pain: 'システム間の分断／二重入力',
    colors: { primary: 0x7fb4f5, accent: 0x2f5f9f, fog: 0x080d18 },
    objects: ['monitor', 'window', 'window', 'monitor', 'window'],
  },
  {
    id: 'cloud',
    no: '04',
    title: 'クラウドの時代',
    titleEn: 'CLOUD',
    years: '2010s〜',
    floatText: 'どこからでも、つながる。',
    description:
      'サーバーを持たなくてよくなり、データは常に最新の一箇所へ。場所を選ばず働けるようになり、システム同士もAPIでつながるようになりました。',
    pain: '使いこなせない／コストが読めない',
    colors: { primary: 0x8fe6ea, accent: 0x2f8f9f, fog: 0x061416 },
    objects: ['cloud', 'server', 'cloud', 'node', 'server'],
  },
  {
    id: 'ai',
    no: '05',
    title: 'AIの時代',
    titleEn: 'ARTIFICIAL INTELLIGENCE',
    years: 'NOW',
    floatText: '考える手前まで、任せられる。',
    description:
      '文章を書く、書類を読み取る、複雑な条件から答えを組み立てる。これまで人にしかできなかった判断の手前までを、AIが引き受けられるようになりました。KotoHubは、この時代の道具を中小企業の現場へ届けます。',
    pain: '——ここから、一緒に考えましょう。',
    colors: { primary: 0xf7e08c, accent: 0xd4af37, fog: 0x16120a },
    objects: ['node', 'shard', 'node', 'shard', 'node'],
  },
  {
    id: 'future',
    no: '06',
    title: '未来の新時代',
    titleEn: 'THE NEXT ERA',
    years: 'NEXT',
    floatText: 'その先は、一緒に作る。',
    description:
      'この先に何があるかは、まだ誰も知りません。決まっているのは、待っていても届かないということだけです。御社の現場にある課題と、いま手に入る技術。その2つを持ち寄って、次の時代の当たり前をここから一緒に作っていきましょう。',
    pain: 'まだ、白紙です。',
    colors: { primary: 0xffffff, accent: 0xd4af37, fog: 0x0a0a12 },
    objects: ['frame', 'spark', 'frame', 'spark', 'frame'],
  },
];

/** ゾーン1つあたりのZ方向の長さ */
export const ZONE_DEPTH = 120;
