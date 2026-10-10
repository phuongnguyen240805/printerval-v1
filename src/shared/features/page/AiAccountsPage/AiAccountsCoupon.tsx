import { CatalogDialog } from '@/shared/ui/liquid/CatalogDialog';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './AiAccountsCoupon.module.css';

const SEEN_KEY = 'printerval-ai-landing-coupon-seen';
const COLLECTED_KEY = 'printerval-ai-landing-coupon-collected';

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

/** One coupon experience and session state shared across the catalog and offer pages. */
export function AiAccountsCoupon() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [collected, setCollected] = useState(false);
  useEffect(() => {
    setMounted(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      setCollected(sessionStorage.getItem(COLLECTED_KEY) === '1' || sessionStorage.getItem('printerval-ai-cursor-coupon-collected') === '1');
      if (sessionStorage.getItem(SEEN_KEY) !== '1') timer = setTimeout(() => setOpen(true), 120);
    } catch { /* Manual opening remains available without storage. */ }
    return () => clearTimeout(timer);
  }, []);
  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* Storage is optional. */ }
  };
  const collect = () => {
    setCollected(true);
    try { sessionStorage.setItem(SEEN_KEY, '1'); sessionStorage.setItem(COLLECTED_KEY, '1'); } catch { /* Keep the current session's state. */ }
  };
  if (!mounted) return null;
  return <>
    {!open && createPortal(<button type="button" className={styles.floatingCoupon} onClick={() => setOpen(true)} aria-label="Mở phiếu giảm giá"><img src="/assets/ai-accounts/detail/coupon.svg" alt="" /></button>, document.body)}
    <CatalogDialog open={open} onClose={close} title="Phiếu giảm giá" className="max-w-[500px] p-4 sm:p-6">
      <button type="button" data-catalog-variant="text" className="absolute right-3 top-3 h-11 w-11 text-2xl" onClick={close} aria-label="Đóng phiếu giảm giá">×</button>
      <div className={styles.inlineHero}><GiftArt /></div>
      <div className={styles.tickets}>
        <Ticket title="Người dùng mới · Nạp tiền" date="Tham khảo điều kiện của từng ưu đãi" discount="6% OFF" />
        <Ticket title="Ưu đãi chào mừng Marketplace" date="Tham khảo điều kiện của từng ưu đãi" discount="15% OFF" />
      </div>
      <div className="mt-5 text-center">
        <p role="status" className="mb-3 text-sm text-gray-600">{collected ? 'Đã lưu 2 phiếu trong phiên duyệt hiện tại.' : 'Lưu phiếu để xem lại khi lựa chọn gói.'}</p>
        <button type="button" data-catalog-variant="primary" className="w-full px-5 py-3 disabled:opacity-60" onClick={collect} disabled={collected}>{collected ? 'Đã thu thập phiếu' : 'Thu thập phiếu giảm giá'}</button>
        <p className="mt-3 text-xs leading-5 text-gray-500">Phiếu tham khảo chưa được áp dụng vào thanh toán.</p>
      </div>
    </CatalogDialog>
  </>;
}
