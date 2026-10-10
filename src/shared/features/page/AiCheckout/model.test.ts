import {
  periodMonths,
  quote,
  validatePreviewCard,
  type CheckoutItem,
} from './model';
import { productCheckout, offerCheckout } from './adapters';
import { products } from '../AiAccountsPage/mockData';
import { accountDetails } from '../AiAccountDetailPage/mockDetailData';

describe('checkout quote and preview constraints', () => {
  test.each([
    ['1 năm', 12],
    ['3 tháng', 3],
    ['/ tháng', 1],
    ['2 năm', 24],
  ])('reads duration %s', (label, expected) => {
    expect(periodMonths(label)).toBe(expected);
  });
  test('annual quoted amount is not charged twelve times', () => {
    const item: CheckoutItem = {
      id: 'annual',
      name: 'AI',
      title: 'Annual',
      logo: '',
      price: 1200000,
      periodMonths: 12,
      access: 'Private',
    };
    expect(quote(item, 12)).toBe(1200000);
    expect(quote(item, 24)).toBe(2400000);
  });
  test('each catalog and marketplace offer retains its exact initial quote', () => {
    for (const product of products) {
      const item = productCheckout(product);
      expect(quote(item, item.periodMonths)).toBe(product.price);
      for (const offer of product.offers ?? []) {
        const selected = productCheckout(product, offer.price, offer.title);
        expect(quote(selected, selected.periodMonths)).toBe(offer.price);
      }
    }
    for (const data of Object.values(accountDetails))
      for (const offer of data.offers) {
        const item = offerCheckout(data, offer);
        expect(quote(item, item.periodMonths)).toBe(offer.price);
        expect(item.seller).toBe(offer.seller);
      }
  });
  test('top-ups are one-time purchases', () => {
    const recharge = products.find(product => product.id.includes('recharge'))!;
    expect(productCheckout(recharge).oneTime).toBe(true);
  });
  test('only the documented test card can complete preview', () => {
    expect(
      validatePreviewCard('4242 4242 4242 4242', '12/30', '123', 'Demo'),
    ).toEqual({});
    expect(
      validatePreviewCard('4111 1111 1111 1111', '13/30', '12', ''),
    ).toEqual({
      number: expect.any(String),
      expiry: expect.any(String),
      cvv: expect.any(String),
      name: expect.any(String),
    });
  });
});
