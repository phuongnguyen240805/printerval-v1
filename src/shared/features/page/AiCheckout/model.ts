export interface CheckoutItem {
  id: string;
  name: string;
  title: string;
  logo: string;
  price: number;
  currencyCode?: string;
  periodMonths: number;
  access: string;
  seller?: string;
  warranty?: string;
  oneTime?: boolean;
}

/** Preserve the quoted period. Annual and marketplace prices are not monthly rates. */
export function periodMonths(label = ''): number {
  const months = label.match(/(\d+)\s*tháng/i);
  if (months) return Number(months[1]);
  const years = label.match(/(\d+)\s*năm/i);
  return years ? Number(years[1]) * 12 : 1;
}

export const formatMoney = (value: number, currencyCode = 'vnd') =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
    maximumFractionDigits: currencyCode.toLowerCase() === 'vnd' ? 0 : 2,
  }).format(value);

export function quote(item: CheckoutItem, months: number) {
  return Math.round((item.price * months) / item.periodMonths);
}

export function validatePreviewCard(
  number: string,
  expiry: string,
  cvv: string,
  name: string,
) {
  const errors: Partial<Record<'number' | 'expiry' | 'cvv' | 'name', string>> =
    {};
  if (number.replace(/\s/g, '') !== '4242424242424242')
    errors.number = 'Dùng số thẻ thử nghiệm 4242 4242 4242 4242.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim()))
    errors.expiry = 'Nhập MM/YY, ví dụ 12/30.';
  if (!/^\d{3}$/.test(cvv.trim())) errors.cvv = 'Nhập 3 chữ số thử nghiệm.';
  if (!name.trim()) errors.name = 'Nhập tên thử nghiệm.';
  return errors;
}
