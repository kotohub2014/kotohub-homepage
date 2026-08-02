import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import { ArrowRight } from '../components/Icons';
import { brand, services } from '../data/content';

/**
 * 送信先エンドポイント。
 * Vercel の環境変数 `VITE_CONTACT_ENDPOINT` に Formspree / Resend / 自前APIのURLを設定すると
 * そこへ JSON で POST します。未設定の場合はメーラーを起動するフォールバック動作になります。
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

const BUDGETS = ['〜30万円', '30〜100万円', '100〜300万円', '300万円〜', '未定 / 相談したい'];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!data.name?.trim()) nextErrors.name = 'お名前をご入力ください。';
    if (!data.email?.trim()) nextErrors.email = 'メールアドレスをご入力ください。';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) nextErrors.email = 'メールアドレスの形式をご確認ください。';
    if (!data.message?.trim()) nextErrors.message = 'ご相談内容をご入力ください。';
    if (!data.consent) nextErrors.consent = 'プライバシーポリシーへの同意が必要です。';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');

    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('sent');
        form.reset();
      } catch {
        setStatus('error');
      }
      return;
    }

    // フォールバック: メーラーを起動して本文を引き継ぐ
    const body = [
      `会社名 / 屋号: ${data.company || '(未記入)'}`,
      `お名前: ${data.name}`,
      `メールアドレス: ${data.email}`,
      `電話番号: ${data.phone || '(未記入)'}`,
      `ご相談内容の種類: ${data.topic || '(未選択)'}`,
      `ご予算: ${data.budget || '(未選択)'}`,
      '',
      'ご相談内容:',
      data.message,
    ].join('\n');

    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(
      `【お問い合わせ】${data.company || data.name} 様`,
    )}&body=${encodeURIComponent(body)}`;
    setStatus('sent');
  };

  return (
    <div className="page">
      <PageHead
        eyebrow="Contact"
        en="CONTACT"
        title={
          <>
            まずは、
            <span className="gold-text gold-text--shimmer">話すところから。</span>
          </>
        }
        lead="ご相談・お見積りは無料です。「これはITで解決できるのか」「予算内で何ができるのか」——判断に必要な材料をお渡しします。無理な営業は一切いたしません。"
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="contact-grid">
            {/* --- 左: 連絡先情報 --- */}
            <Reveal className="contact-info">
              <div className="contact-info__item">
                <p className="contact-info__label">EMAIL</p>
                <p className="contact-info__value">
                  <a href={`mailto:${brand.email}`}>{brand.email}</a>
                </p>
                <p className="contact-info__note">24時間受付・2営業日以内にご返信します。</p>
              </div>

              <div className="contact-info__item">
                <p className="contact-info__label">BUSINESS HOURS</p>
                <p className="contact-info__value">平日 10:00 - 19:00</p>
                <p className="contact-info__note">土日祝はお休みをいただいております。</p>
              </div>

              <div className="contact-info__item">
                <p className="contact-info__label">AREA</p>
                <p className="contact-info__value">全国対応（オンライン）</p>
                <p className="contact-info__note">
                  Zoom / Google Meet / Teams に対応。ご要望に応じて訪問も承ります。
                </p>
              </div>

              <div className="contact-info__item">
                <p className="contact-info__label">こんなご相談を歓迎します</p>
                <ul className="dot-list" style={{ marginTop: 14 }}>
                  <li>何から手を付ければいいか分からない</li>
                  <li>他社の見積りが高く、諦めかけている</li>
                  <li>AIを入れたいが、使い道が定まらない</li>
                  <li>Excel運用の限界を感じている</li>
                  <li>作ったシステムが放置されている</li>
                </ul>
              </div>
            </Reveal>

            {/* --- 右: フォーム --- */}
            <Reveal delay={0.1}>
              <form className="form" onSubmit={handleSubmit} noValidate>
                {status === 'sent' && (
                  <p className="form__result" role="status">
                    送信ありがとうございます。内容を確認のうえ、2営業日以内にご返信いたします。
                    {!ENDPOINT && ' （メールソフトが起動しない場合は、お手数ですが上記アドレス宛に直接ご連絡ください。）'}
                  </p>
                )}
                {status === 'error' && (
                  <p className="form__result" role="alert" style={{ borderColor: 'rgba(255,120,120,.4)' }}>
                    送信に失敗しました。お手数ですが {brand.email} 宛に直接ご連絡ください。
                  </p>
                )}

                <div className="form__row form__row--2">
                  <div>
                    <label className="form__label" htmlFor="company">
                      会社名 / 屋号
                      <span className="form__req form__req--optional">任意</span>
                    </label>
                    <input className="form__input" id="company" name="company" placeholder="株式会社○○" />
                  </div>
                  <div>
                    <label className="form__label" htmlFor="name">
                      お名前
                      <span className="form__req">必須</span>
                    </label>
                    <input className="form__input" id="name" name="name" placeholder="山田 太郎" />
                    {errors.name && <p className="form__error">{errors.name}</p>}
                  </div>
                </div>

                <div className="form__row form__row--2">
                  <div>
                    <label className="form__label" htmlFor="email">
                      メールアドレス
                      <span className="form__req">必須</span>
                    </label>
                    <input
                      className="form__input"
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="form__error">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="form__label" htmlFor="phone">
                      電話番号
                      <span className="form__req form__req--optional">任意</span>
                    </label>
                    <input
                      className="form__input"
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="03-0000-0000"
                    />
                  </div>
                </div>

                <div className="form__row form__row--2">
                  <div>
                    <label className="form__label" htmlFor="topic">
                      ご相談の種類
                      <span className="form__req form__req--optional">任意</span>
                    </label>
                    <select className="form__select" id="topic" name="topic" defaultValue="">
                      <option value="">選択してください</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="その他 / まだ決まっていない">その他 / まだ決まっていない</option>
                    </select>
                  </div>
                  <div>
                    <label className="form__label" htmlFor="budget">
                      ご予算の目安
                      <span className="form__req form__req--optional">任意</span>
                    </label>
                    <select className="form__select" id="budget" name="budget" defaultValue="">
                      <option value="">選択してください</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form__row">
                  <label className="form__label" htmlFor="message">
                    ご相談内容
                    <span className="form__req">必須</span>
                  </label>
                  <textarea
                    className="form__textarea"
                    id="message"
                    name="message"
                    placeholder="現在お困りのこと、実現したいこと、ご希望の時期などをお聞かせください。決まっていない点は「未定」で構いません。"
                  />
                  {errors.message && <p className="form__error">{errors.message}</p>}
                </div>

                <label className="form__consent" htmlFor="consent">
                  <input type="checkbox" id="consent" name="consent" value="agreed" />
                  <span>
                    <Link to="/privacy">プライバシーポリシー</Link>
                    に同意のうえ送信します。
                  </span>
                </label>
                {errors.consent && (
                  <p className="form__error" style={{ marginTop: -18, marginBottom: 20 }}>
                    {errors.consent}
                  </p>
                )}

                <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
                  {status === 'sending' ? '送信中...' : '送信する'}
                  <ArrowRight className="btn__arrow" />
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
