import { filterOffers } from './offerFilters';
import { accountDetails } from './mockDetailData';

const offers = accountDetails.cursor.offers;
describe('marketplace offer filters', () => {
  it('returns actual inventory and does not mutate prices', () => {
    const prices = offers.map(offer => offer.price);
    expect(filterOffers(offers, '', {}, '', '')).toHaveLength(8);
    expect(offers.map(offer => offer.price)).toEqual(prices);
  });
  it('combines alternatives within a group and intersects groups', () => {
    const result = filterOffers(
      offers,
      '',
      { Gói: ['Pro', 'Pro+'], 'Thời lượng': ['1 năm'] },
      '',
      '',
    );
    expect(result.map(offer => offer.id)).toEqual([
      'cursor-year',
      'cursor-year-email',
    ]);
  });
  it('matches Pro exactly without including Pro+ or Ultra', () => {
    expect(filterOffers(offers, '', { Gói: ['Pro'] }, '', '')).toHaveLength(5);
    expect(
      filterOffers(offers, '', { Gói: ['Pro'] }, '', '').every(
        offer => offer.plan === 'Pro',
      ),
    ).toBe(true);
    expect(filterOffers(offers, '', { Gói: ['Enterprise'] }, '', '')).toEqual(
      [],
    );
  });
  it('supports inclusive price boundaries and invalid intervals', () => {
    expect(filterOffers(offers, '', {}, '779163', '779163')).toHaveLength(2);
    expect(filterOffers(offers, '', {}, '1000000', '0')).toEqual([]);
  });
  it('searches sellers and allows clearing all constraints', () => {
    expect(
      filterOffers(offers, '  NEXORA  ', {}, '', '').map(offer => offer.id),
    ).toEqual(['cursor-pro-nexora']);
    expect(filterOffers(offers, '', {}, '', '')).toHaveLength(offers.length);
  });
});
