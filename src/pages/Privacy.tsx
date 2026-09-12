import { Link } from 'react-router-dom';

import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import { brand } from '../data/content';

export default function Privacy() {
  return (
    <div className="page">
      <PageHead
        eyebrow="Privacy policy"
        en="PRIVACY"
        title="プライバシーポリシー"
        lead={`${brand.name}（以下「当方」）は、お客様の個人情報の重要性を認識し、以下のとおり取り扱います。`}
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <Reveal className="prose">
            <h2>1. 取得する情報</h2>
            <p>
              当方は、お問い合わせフォームを通じて、お名前、会社名・屋号、メールアドレス、電話番号、ご相談内容等の情報を取得します。また、サイトの利用状況を把握するため、アクセスログ等の情報を取得する場合があります。
            </p>

            <h2>2. 利用目的</h2>
            <ul>
              <li>お問い合わせへの回答、ご提案・お見積りの作成のため</li>
              <li>業務のご依頼をいただいた場合の連絡・履行のため</li>
              <li>サービス品質の向上およびサイトの改善のため</li>
            </ul>

            <h2>3. 第三者提供</h2>
            <p>
              当方は、法令に基づく場合を除き、あらかじめご本人の同意を得ることなく、個人情報を第三者に提供することはありません。
            </p>

            <h2>4. 業務委託</h2>
            <p>
              利用目的の達成に必要な範囲で、外部のクラウドサービス（メール配信、ホスティング、フォーム送信基盤等）に個人情報の取り扱いを委託する場合があります。その際は、委託先に対して必要かつ適切な監督を行います。
            </p>

            <h2>5. 安全管理措置</h2>
            <p>
              取得した個人情報について、漏えい、滅失またはき損の防止その他の安全管理のために必要かつ適切な措置を講じます。
            </p>

            <h2>6. 機密保持</h2>
            <p>
              業務上知り得たお客様の情報（システム構成、業務データ、経営情報等）は、秘密保持義務のもとで厳格に管理します。ご要望に応じて秘密保持契約（NDA）を締結いたします。
            </p>

            <h2>7. Cookie・アクセス解析</h2>
            {/* **使っているものを名指しする。** 「解析ツールを利用する場合が
                あります」だけでは、何が動いているのか読み手に分からない。
                実際に読み込んでいるのは GTM 経由の Google アナリティクス
                (index.html の GTM-T3K2F54L)。広告配信の審査でもここを見られる。 */}
            <p>
              本サイトでは、利用状況の把握のために <strong>Google
              アナリティクス</strong>（Google タグ マネージャー経由）を利用しています。Cookie
              を使用してアクセス状況を収集しますが、氏名やメールアドレスなど個人を特定できる情報は含みません。
            </p>
            <ul>
              <li>
                収集されるデータの取り扱いは{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--gold)' }}
                >
                  Google のポリシーと規約
                </a>{' '}
                に従います。
              </li>
              <li>
                収集を停止したい場合は{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--gold)' }}
                >
                  Google アナリティクス オプトアウト アドオン
                </a>{' '}
                をご利用いただくか、ブラウザの設定で Cookie を無効にしてください。
              </li>
              <li>無効にした場合でも、本サイトの閲覧に支障はありません。</li>
            </ul>

            {/* **広告の扱いを書いておく。** 運営サービス (ai-mate) で
                第三者配信の広告を出すため、配信事業者への申請でここを見られる */}
            <h2>8. 広告について</h2>
            {/* **この節は事業全体の傘。** AdSense のサイト登録は
                ルートドメイン (kotohub.info) 単位で、同意メッセージも
                そのドメインに紐づく。メッセージから開くポリシーは
                **事業者のもの**である必要があるので、ここで
                「どのサイトに広告があるか」「誰が配信しているか」
                「どう止められるか」をまとめて書く。
                サービスごとの細部は ai-mate 側のポリシーへ渡す。 */}
            <p>
              当方（{brand.name}）が運営するサイトのうち、広告を掲載しているのは次のとおりです。
            </p>
            <ul>
              <li>
                <strong>www.kotohub.info（本サイト）</strong> — 広告を掲載していません。
              </li>
              <li>
                <strong>aimate.kotohub.info（ai-mate）</strong> — 広告を掲載しています。
              </li>
            </ul>

            <h3>配信事業者</h3>
            <p>
              広告の配信には <strong>Google AdSense</strong> をはじめとする第三者配信事業者を利用しています。これらの事業者は、Cookie
              や広告識別子を使用して、利用者が本サイトや他のサイトを訪れた際の情報に基づく広告を表示することがあります。
            </p>
            <ul>
              <li>
                広告の表示にあたり、<strong>氏名・メールアドレス・お問い合わせの内容・ai-mate
                での会話の内容が広告事業者へ渡ることはありません。</strong>
              </li>
              <li>
                Google が広告配信のためにデータをどう扱うかは{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--gold)' }}
                >
                  Google のポリシーと規約
                </a>{' '}
                をご覧ください。
              </li>
            </ul>

            <h3>広告を自分で止めるには</h3>
            <ul>
              <li>
                パーソナライズ広告（興味に応じた広告）は{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--gold)' }}
                >
                  Google の広告設定
                </a>{' '}
                から無効にできます。
              </li>
              <li>
                第三者配信事業者をまとめて無効にしたい場合は{' '}
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--gold)' }}
                >
                  aboutads.info
                </a>{' '}
                をご利用ください。
              </li>
              <li>ブラウザの設定で Cookie を無効にすることもできます。</li>
            </ul>

            {/* **同意の取り直しに触れておく。** 同意メッセージ (CMP) には
                あとから開き直す導線があるので、ポリシー側にも一行置く。 */}
            <h3>EEA・英国・スイスからご覧の方</h3>
            <p>
              上記の地域からアクセスされた場合、広告用の Cookie
              を使用する前に同意を求める画面を表示します。いただいた同意は、同じ画面からいつでも変更・撤回できます。
            </p>

            <h3>サービスごとの詳細</h3>
            <p>
              ai-mate におけるデータの取り扱い（アカウント、会話の内容、保存期間など）は{' '}
              <a
                href="https://aimate.kotohub.info/legal/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--gold)' }}
              >
                ai-mate のプライバシーポリシー
              </a>{' '}
              に定めています。本ポリシーと ai-mate
              のポリシーが異なる場合は、当該サービスについては ai-mate のポリシーが優先します。
            </p>

            <h2>9. 開示・訂正・削除のご請求</h2>
            <p>
              ご本人からの個人情報の開示、訂正、利用停止、削除のお求めがあった場合は、ご本人であることを確認のうえ、法令に従い速やかに対応いたします。
            </p>

            <h2>10. 事業者とお問い合わせ窓口</h2>
            {/* **個人情報を扱っている主体を名指しする。** 同意メッセージ (CMP)
                から開かれるページなので、誰が管理者なのかがここだけで分かる
                必要がある。住所などの詳細は事業者情報のページへ。 */}
            <ul>
              <li>
                屋号：<strong>KotoHub（コトハブ）</strong>（個人事業）
              </li>
              <li>運営責任者：三好 智</li>
              <li>
                所在地・電話番号は{' '}
                <Link to="/about" style={{ color: 'var(--gold)' }}>
                  事業者情報
                </Link>{' '}
                に掲載しています。
              </li>
              <li>
                本ポリシーに関するお問い合わせ：
                <a href={`mailto:${brand.email}`} style={{ color: 'var(--gold)' }}>
                  {brand.email}
                </a>
              </li>
            </ul>

            <h2>11. 改定</h2>
            <p>
              当方は、法令の変更や事業内容の変化に応じて、本ポリシーを改定することがあります。改定後の内容は本ページに掲載した時点から効力を生じるものとします。
            </p>

            <p style={{ marginTop: 40, color: 'var(--text-faint)', fontSize: 13 }}>
              制定日：2026年8月2日{/* 初回公開のコミット日。実際と違えば直すこと */}
              <br />
              {/* **改定したら必ず日付を出す。** 広告と解析の記載を足したのは
                  この日。同意メッセージ (CMP) から開かれるページなので、
                  いつ時点の内容なのかが読み取れる必要がある */}
              最終改定日：2026年9月12日
              <br />
              {brand.name}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
