import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  X,
} from 'lucide-react';
import { CatalogDialog } from '@/shared/ui/liquid/CatalogDialog';
import {
  formatMoney,
  quote,
  validatePreviewCard,
  type CheckoutItem,
} from './model';
import styles from './AiCheckoutDialog.module.css';

type Step = 'purchase' | 'payment' | 'card' | 'complete';

/** One shared, frontend-only checkout. Card values never leave this component. */
export function AiCheckoutDialog({
  item,
  onClose,
}: {
  item: CheckoutItem;
  onClose: () => void;
}) {
  return <CheckoutSession key={item.id} item={item} onClose={onClose} />;
}

function CheckoutSession({
  item,
  onClose,
}: {
  item: CheckoutItem;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>('purchase');
  const [months, setMonths] = useState(item.periodMonths);
  const [renew, setRenew] = useState(!item.oneTime);
  const [method, setMethod] = useState('card');
  const [details, setDetails] = useState(false);
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<ReturnType<typeof validatePreviewCard>>(
    {},
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (step !== 'purchase') heading.current?.focus();
    body.current?.scrollTo?.({ top: 0 });
  }, [step]);
  const total = quote(item, months);
  // Marketplace quotes and top-ups retain their exact duration and price.
  const terms =
    item.seller || item.oneTime
      ? [item.periodMonths]
      : Array.from(new Set([item.periodMonths, 3, 6, 12])).sort(
          (a, b) => a - b,
        );
  const title =
    step === 'purchase'
      ? `Chọn gói ${item.name}`
      : step === 'payment'
        ? 'Chọn phương thức thanh toán'
        : step === 'card'
          ? 'Thanh toán an toàn'
          : 'Hoàn tất xem trước';
  const chooseRenew = (value: boolean) => {
    setRenew(value);
    setMethod('card');
  };
  const complete = () => {
    setNumber('');
    setExpiry('');
    setCvv('');
    setName('');
    setErrors({});
    setStep('complete');
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validatePreviewCard(number, expiry, cvv, name);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      document.getElementById(`preview-card-${first}`)?.focus();
      return;
    }
    complete();
  };
  const footer = (label: string, action: () => void) => (
    <div className={styles.actions}>
      <button type="button" data-catalog-variant="secondary" onClick={onClose}>
        Hủy
      </button>
      <button type="button" data-catalog-variant="primary" onClick={action}>
        {label}
      </button>
    </div>
  );

  return (
    <CatalogDialog
      open
      onClose={onClose}
      title={title}
      size={step === 'complete' ? 'card' : step}
      className={styles.dialog}
    >
      <header className={styles.header}>
        {step !== 'purchase' && step !== 'complete' && (
          <button
            type="button"
            data-catalog-variant="text"
            className={styles.iconButton}
            aria-label="Quay lại"
            onClick={() => setStep(step === 'card' ? 'payment' : 'purchase')}
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <h2 ref={heading} tabIndex={-1}>
          {title}
        </h2>
        <button
          type="button"
          data-catalog-variant="text"
          className={styles.iconButton}
          aria-label="Đóng"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </header>
      <div ref={body} className={styles.body}>
        {step === 'purchase' && (
          <>
            <div className={styles.product}>
              <div className={styles.logo}>
                <img src={item.logo} alt={item.name} />
              </div>
              <div className={styles.productCopy}>
                <strong className={styles.price}>{formatMoney(total, item.currencyCode)}</strong>
                <p>{item.title}</p>
                <div className={styles.pills}>
                  <span>Chưa thêm bảo vệ bổ sung</span>
                  <span>
                    {item.oneTime
                      ? 'Thanh toán một lần'
                      : `${formatMoney(total / months, item.currencyCode)} / tháng`}
                  </span>
                </div>
                {!item.oneTime && (
                  <p className={styles.muted}>
                    Giá gia hạn tham khảo {formatMoney(total, item.currencyCode)} / {months} tháng
                  </p>
                )}
              </div>
            </div>
            <section className={styles.section}>
              <h3>{item.oneTime ? 'Giá trị gói' : 'Tùy chọn thời hạn'}</h3>
              <div className={styles.options}>
                {terms.map(term => (
                  <button
                    type="button"
                    key={term}
                    aria-pressed={months === term}
                    className={`${styles.option} ${months === term ? styles.selected : ''}`}
                    onClick={() => setMonths(term)}
                  >
                    {item.oneTime ? 'Gói đang chọn' : `${term} tháng`}
                    {months === term && (
                      <small>
                        <Check size={14} /> Đã chọn
                      </small>
                    )}
                  </button>
                ))}
              </div>
              {!item.oneTime && (
                <>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={renew}
                      onChange={event => chooseRenew(event.target.checked)}
                    />{' '}
                    Bật tự động gia hạn
                  </label>
                  <p className={styles.hint}>
                    Tùy chọn mô phỏng. Chưa kích hoạt gia hạn hoặc trừ tiền.
                  </p>
                </>
              )}
            </section>
            <section className={styles.section}>
              <h3>Chọn loại</h3>
              <div className={styles.options}>
                <button
                  type="button"
                  aria-pressed
                  className={`${styles.option} ${styles.selected}`}
                >
                  {item.access}
                </button>
              </div>
              {item.seller && (
                <p className={styles.hint}>Người bán: {item.seller}</p>
              )}
            </section>
            <section className={styles.section}>
              <h3>
                <ShieldCheck size={19} /> Bảo vệ gói
              </h3>
              <div className={styles.options}>
                <button
                  type="button"
                  aria-pressed
                  className={`${styles.option} ${styles.selected}`}
                >
                  Chưa thêm bảo vệ bổ sung
                </button>
                <span className={styles.protection}>
                  <ShieldCheck size={22} />{' '}
                  {item.warranty
                    ? `Bảo hành: ${item.warranty}`
                    : 'Bảo vệ toàn kỳ · chưa cung cấp'}
                </span>
              </div>
              <p className={styles.hint}>
                Giá được tính theo dữ liệu gói hiện tại. Quyền lợi bổ sung chưa
                được tích hợp.
              </p>
            </section>
          </>
        )}
        {step === 'payment' && (
          <>
            <p className={styles.notice}>
              <LockKeyhole size={22} />
              <span>
                Đây là luồng xem trước giao diện. Chưa kết nối nhà cung cấp
                thanh toán, không tạo giao dịch.
              </span>
            </p>
            <div
              className={styles.tabs}
              role="group"
              aria-label="Hình thức thanh toán"
            >
              {!item.oneTime && (
                <button
                  type="button"
                  data-catalog-variant="text"
                  aria-pressed={renew}
                  className={renew ? styles.activeTab : ''}
                  onClick={() => chooseRenew(true)}
                >
                  Tự động gia hạn
                </button>
              )}
              <button
                type="button"
                data-catalog-variant="text"
                aria-pressed={!renew}
                className={!renew ? styles.activeTab : ''}
                onClick={() => chooseRenew(false)}
              >
                Thanh toán một lần
              </button>
            </div>
            <div className={styles.methods}>
              <div className={styles.methodList}>
                <button
                  type="button"
                  aria-pressed={method === 'card'}
                  className={`${styles.method} ${method === 'card' ? styles.selected : ''}`}
                  onClick={() => setMethod('card')}
                >
                  <span className={styles.methodTitle}>
                    <CreditCard size={22} /> Thẻ tín dụng &amp; thẻ ghi nợ{' '}
                    <Check size={18} />
                  </span>
                  <span className={styles.brands}>
                    {[
                      'VISA',
                      'Mastercard',
                      'AMEX',
                      'Discover',
                      'JCB',
                      'UnionPay',
                    ].map(brand => (
                      <span key={brand}>{brand}</span>
                    ))}
                  </span>
                  {renew && <small>Tự động gia hạn</small>}
                </button>
                {!renew && (
                  <button
                    type="button"
                    aria-pressed={method === 'paypal'}
                    className={`${styles.method} ${method === 'paypal' ? styles.selected : ''}`}
                    onClick={() => setMethod('paypal')}
                  >
                    <span className={styles.methodTitle}>
                      PayPal {method === 'paypal' && <Check size={18} />}
                    </span>
                    <span className={styles.hint}>
                      Xem trước lựa chọn ví điện tử
                    </span>
                  </button>
                )}
              </div>
              <aside className={styles.help}>
                <strong>
                  {renew
                    ? 'Muốn thanh toán một lần?'
                    : 'Lựa chọn phù hợp với bạn'}
                </strong>
                <p>
                  {renew
                    ? 'Bạn có thể đổi hình thức thanh toán trước khi tiếp tục.'
                    : 'Tổng tiền và thời hạn được giữ nhất quán trong toàn bộ luồng.'}
                </p>
                {renew && (
                  <button
                    type="button"
                    data-catalog-variant="text"
                    onClick={() => chooseRenew(false)}
                  >
                    Thử thanh toán một lần
                  </button>
                )}
              </aside>
            </div>
          </>
        )}
        {step === 'card' && (
          <form
            id="preview-card-form"
            onSubmit={submit}
            noValidate
            autoComplete="off"
            className={styles.form}
          >
            <p className={styles.demoNote}>
              Chỉ dùng dữ liệu thử nghiệm: 4242 4242 4242 4242 · 12/30 · 123.
              Không lưu thông tin thẻ.
            </p>
            <CardField
              field="number"
              label="Số thẻ"
              value={number}
              onChange={value =>
                setNumber(
                  value
                    .replace(/\D/g, '')
                    .slice(0, 16)
                    .replace(/(.{4})/g, '$1 ')
                    .trim(),
                )
              }
              placeholder="4242 4242 4242 4242"
              error={errors.number}
            />
            <div className={styles.fieldRow}>
              <CardField
                field="expiry"
                label="Ngày hết hạn"
                value={expiry}
                onChange={value => {
                  const digits = value.replace(/\D/g, '').slice(0, 4);
                  setExpiry(
                    digits.length > 2
                      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                      : digits,
                  );
                }}
                placeholder="MM/YY"
                error={errors.expiry}
              />
              <CardField
                field="cvv"
                label="CVV"
                value={cvv}
                onChange={value => setCvv(value.replace(/\D/g, '').slice(0, 3))}
                placeholder="3 chữ số"
                error={errors.cvv}
              />
            </div>
            <CardField
              field="name"
              label="Tên trên thẻ"
              value={name}
              onChange={value => setName(value.slice(0, 80))}
              placeholder="Tên thử nghiệm"
              error={errors.name}
            />
            <label className={`${styles.checkbox} ${styles.muted}`}>
              <input type="checkbox" disabled /> Lưu thẻ cho các lần thanh toán
              sau (chưa hỗ trợ)
            </label>
          </form>
        )}
        {step === 'complete' && (
          <div className={styles.complete}>
            <span>
              <Check size={32} />
            </span>
            <h3>Đã hoàn tất xem trước</h3>
            <p>
              {item.name} · {formatMoney(total, item.currencyCode)}
            </p>
            <p className={styles.muted}>
              Không tạo đơn hàng, không trừ tiền và không lưu thông tin thanh
              toán.
            </p>
          </div>
        )}
      </div>
      <footer className={styles.footer}>
        {step === 'purchase' &&
          footer('Đi tới thanh toán', () => setStep('payment'))}
        {step === 'payment' && (
          <>
            <button
              type="button"
              data-catalog-variant="text"
              className={styles.detailToggle}
              aria-expanded={details}
              aria-controls="checkout-breakdown"
              onClick={() => setDetails(!details)}
            >
              Chi tiết{' '}
              <ChevronDown
                size={16}
                className={details ? styles.rotated : ''}
              />
            </button>
            {details && (
              <dl id="checkout-breakdown" className={styles.breakdown}>
                <div>
                  <dt>Gói</dt>
                  <dd>{item.title}</dd>
                </div>
                <div>
                  <dt>Thời hạn</dt>
                  <dd>{item.oneTime ? 'Một lần' : `${months} tháng`}</dd>
                </div>
                <div>
                  <dt>Bảo vệ bổ sung</dt>
                  <dd>Chưa thêm</dd>
                </div>
              </dl>
            )}
            <div className={styles.total}>
              <strong>Tổng cộng:</strong>
              <div>
                <strong className={styles.price}>{formatMoney(total, item.currencyCode)}</strong>
                {renew && (
                  <p className={styles.muted}>
                    Giá gia hạn {formatMoney(total, item.currencyCode)} / {months} tháng
                  </p>
                )}
              </div>
            </div>
            {footer('Thanh toán ngay', () =>
              method === 'card' ? setStep('card') : complete(),
            )}
          </>
        )}
        {step === 'card' && (
          <>
            <button
              type="submit"
              form="preview-card-form"
              data-catalog-variant="primary"
              className={styles.pay}
            >
              <LockKeyhole size={18} /> Thanh toán ngay {formatMoney(total, item.currencyCode)}
            </button>
            <p className={styles.security}>
              <ShieldCheck size={22} /> Phiên xem trước · dữ liệu thử nghiệm chỉ
              tồn tại khi modal đang mở.
            </p>
          </>
        )}
        {step === 'complete' && (
          <button
            type="button"
            data-catalog-variant="primary"
            className={styles.pay}
            onClick={onClose}
          >
            Đóng
          </button>
        )}
      </footer>
    </CatalogDialog>
  );
}

function CardField({
  field,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  field: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={`preview-card-${field}`}>
        {label} <span aria-hidden="true">•</span>
      </label>
      <input
        id={`preview-card-${field}`}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={field === 'name' ? 'text' : 'numeric'}
        autoComplete="off"
        required
        aria-invalid={!!error}
        aria-describedby={error ? `preview-error-${field}` : undefined}
      />
      {error && (
        <p id={`preview-error-${field}`} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
