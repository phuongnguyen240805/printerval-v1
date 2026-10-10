import type { PriceInfo } from './types.js';

export const PRICE_PATTERN = String.raw`(?:[$€£₫đ₹￥¥]\s*\d[\d.,]*|(?:USD|VND|JPY|KRW|EUR|GBP)\s*\d[\d.,]*|\d[\d.,]*\s*(?:₫|đ|USD|VND|JPY|KRW|EUR|GBP))(?:\s*\/\s*(?:tháng|month|mo|năm|year))?`;

export function parsePrice(
  raw: string,
  currencyHint: string | null,
  source: PriceInfo['source'],
): PriceInfo | null {
  if (!raw?.trim() || raw.includes('--')) return null;
  const text = raw.replace(/\s+/g, ' ').trim();
  const matched = text.match(new RegExp(PRICE_PATTERN, 'i'))?.[0];
  if (!matched) return null;
  const value = matched.match(/\d[\d.,]*/)?.[0];
  if (!value) return null;
  const iso = matched.match(/USD|VND|JPY|KRW|EUR|GBP/i)?.[0]?.toUpperCase();
  const symbol = matched.match(/[$€£₫đ₹￥¥]/)?.[0];
  const currency =
    iso ||
    (
      {
        $: 'USD',
        '€': 'EUR',
        '£': 'GBP',
        '₫': 'VND',
        đ: 'VND',
        '₹': 'INR',
      } as Record<string, string>
    )[symbol || ''] ||
    currencyHint;
  let number = value;
  if (value.includes(',') && value.includes('.')) {
    const decimal = value.lastIndexOf(',') > value.lastIndexOf('.') ? ',' : '.';
    number = value
      .replace(decimal === ',' ? /\./g : /,/g, '')
      .replace(',', '.');
  } else if (/^\d{1,3}(?:[,.]\d{3})+$/.test(value))
    number = value.replace(/[,.]/g, '');
  else number = value.replace(',', '.');
  const amount = Number(number);
  return {
    raw: text,
    amount: Number.isFinite(amount) ? amount : null,
    currency: currency || null,
    period: /(?:tháng|month|\bmo\b)/i.test(text)
      ? 'month'
      : /(?:năm|year)/i.test(text)
        ? 'year'
        : null,
    source,
  };
}
