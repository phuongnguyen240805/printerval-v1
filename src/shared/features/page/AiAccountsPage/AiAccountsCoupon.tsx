import theme from '@/shared/ui/liquid/CatalogTheme.module.css';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './AiAccountsCoupon.module.css';

const SEEN_KEY = 'printerval-ai-landing-coupon-seen';
const COLLECTED_KEY = 'printerval-ai-landing-coupon-collected';
const LOAD_DELAY = 950;

function GiftArt() {
  return (
    <svg viewBox="0 0 420 160" className={styles.heroArt} aria-hidden="true">
      <polygon points="72,15 80,30 97,32 85,44 88,61 72,52 57,61 60,44 48,32 65,30" fill="#ffd62f" />
      <polygon points="332,5 340,20 357,22 345,34 348,51 332,42 317,51 320,34 308,22 325,20" fill="#ffe054" />
      <path d="M108 53 129 45 141 91 113 96Z" fill="#ff963d" />
      <path d="m103 58-17 9 15 28 19-10Z" fill="#ff7f3d" />
      <path d="m312 52-22-9-13 50 29 7Z" fill="#ff973d" />
      <path d="m319 58 17 8-14 30-20-10Z" fill="#ff783d" />
      <rect x="151" y="72" width="118" height="70" rx="9" fill="#ff6b35" />
      <path d="M151 91h118v51H151Z" fill="#ff4f38" />
      <rect x="198" y="72" width="24" height="70" fill="#ffb91c" />
      <rect x="151" y="84" width="118" height="19" fill="#ff9b1e" />
      <path d="M210 77c-31-9-43-34-24-43 18-8 31 13 24 43Z" fill="#ffc51d" />
      <path d="M210 77c31-9 43-34 24-43-18-8-31 13-24 43Z" fill="#ffd32b" />
      <circle cx="210" cy="73" r="12" fill="#ffab16" />
      <path d="M260 75c8-20 25-29 35-17 10 13-3 31-35 31Z" fill="#ff7761" />
      <circle cx="286" cy="64" r="16" fill="#ff6a56" />
    </svg>
  );
}

function MiniGift() {
  return (
    <svg viewBox="0 0 150 110" className={styles.miniGift} aria-hidden="true">
      <ellipse cx="76" cy="101" rx="58" ry="8" fill="#f4b24f" opacity=".28" />
      <circle cx="53" cy="48" r="11" fill="#ffc24a" />
      <circle cx="72" cy="39" r="9" fill="#ffd05a" />
      <circle cx="93" cy="48" r="11" fill="#ffb93d" />
      <rect x="48" y="59" width="66" height="43" rx="4" fill="#ff6a3d" />
      <rect x="45" y="57" width="72" height="14" rx="4" fill="#ff8c30" />
      <rect x="76" y="57" width="12" height="45" fill="#ffc126" />
      <path d="M82 58c-19-5-27-19-15-24 11-5 19 7 15 24Z" fill="#ffd32b" />
      <path d="M82 58c20-5 28-19 16-24-11-5-20 7-16 24Z" fill="#ffbf1f" />
    </svg>
  );
}

function Ticket({ title, date, discount }: { title: string; date: string; discount: string }) {
  return (
    <article data-liquid-card="" className={styles.ticket}>
      <div className={styles.ticketCopy}>
        <strong>{title}</strong>
        <span>{date}</span>
      </div>
      <div className={styles.ticketDeal}>
        <b>{discount}</b>
        <MiniGift />
      </div>
    </article>
  );
}

export function AiAccountsCoupon() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collected, setCollected] = useState(false);
  const loadTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const clearLoadTimer = () => {
    if (loadTimer.current !== null) {
      window.clearTimeout(loadTimer.current);
      loadTimer.current = null;
    }
  };

  const revealCoupon = () => {
    clearLoadTimer();
    setOpen(true);
    setLoading(true);
    loadTimer.current = window.setTimeout(() => {
      setLoading(false);
      loadTimer.current = null;
    }, LOAD_DELAY);
  };

  useEffect(() => {
    setMounted(true);
    try {
      setCollected(window.sessionStorage.getItem(COLLECTED_KEY) === '1');
      if (window.sessionStorage.getItem(SEEN_KEY) !== '1') {
        window.setTimeout(revealCoupon, 120);
      }
    } catch {
      setOpen(false);
    }
    return () => {
      clearLoadTimer();
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearLoadTimer();
        setLoading(false);
        setOpen(false);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!mounted) return null;

  const close = () => {
    clearLoadTimer();
    setLoading(false);
    setOpen(false);
    try { window.sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* Closing still works when storage is unavailable. */ }
  };

  const collect = () => {
    setCollected(true);
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
      window.sessionStorage.setItem(COLLECTED_KEY, '1');
    } catch { /* Keep the collected state for this visit when storage is unavailable. */ }
    window.setTimeout(() => setOpen(false), 650);
  };

  return createPortal(
    <>
      <button type="button" className={styles.floatingCoupon} onClick={revealCoupon} aria-label="Mở phiếu giảm giá">
        <img src="/assets/ai-accounts/detail/coupon.svg" alt="Coupon" />
      </button>

      {open && (
        <div className={`${styles.backdrop} ${theme.scope}`} onMouseDown={close} role="presentation">
          {loading ? (
            <div data-liquid-surface="" className={styles.discountLoader} role="status" aria-live="polite" onMouseDown={(event) => event.stopPropagation()}>
              <div className={styles.discountLoaderIcon} aria-hidden="true">
                <span>6%</span>
                <span>15%</span>
              </div>
              <strong>Đang tải ưu đãi tốt nhất</strong>
              <p>Đang kiểm tra discount dành cho tài khoản AI...</p>
              <div className={styles.discountProgress} aria-hidden="true"><span /></div>
            </div>
          ) : (
            <section className={styles.dialog} role="dialog" aria-modal="true" aria-label="Phiếu giảm giá" onMouseDown={(event) => event.stopPropagation()}>
              <div className={styles.hero}><GiftArt /></div>
              <button type="button" className={styles.close} onClick={close} aria-label="Đóng phiếu giảm giá">×</button>
              <div data-liquid-surface="" className={styles.shell}>
                <div className={styles.tickets}>
                  <Ticket title="New User – 6% OFF on Top-Ups" date="2026/05/01–2026/12/31" discount="6% OFF" />
                  <Ticket title="Marketplace Subscription Welcome Gift" date="2026/08/31–2026/12/31" discount="15% OFF" />
                </div>
                <div className={styles.footer}>
                  <strong>Phiếu giảm giá sắp hết hạn</strong>
                  <button type="button" onClick={collect} disabled={collected}>
                    {collected ? 'Đã thu thập phiếu giảm giá' : 'Thu thập phiếu giảm giá'}
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </>,
    document.body,
  );
}
