import type { DetailOffer } from '../../ai-catalog/types';

export type OfferFilters = Record<string, string[]>;
export function offerFacet(offer: DetailOffer, group: string): string {
  switch (group) {
    case 'Giao hàng cam kết':
      return offer.delivery;
    case 'Tình trạng có sẵn':
      return offer.availability;
    case 'Thời lượng':
      return offer.duration;
    case 'Phương thức chia sẻ':
      return offer.sharing;
    case 'Gói':
      return offer.plan;
    default:
      return '';
  }
}
export function filterOffers(
  offers: DetailOffer[],
  query: string,
  filters: OfferFilters,
  min: string,
  max: string,
) {
  const text = query.trim().toLocaleLowerCase('vi');
  const lower = min === '' ? 0 : Math.max(0, Number(min));
  const upper = max === '' ? Infinity : Math.max(0, Number(max));
  return offers.filter(
    offer =>
      (!text ||
        `${offer.meta} ${offer.title} ${offer.seller}`
          .toLocaleLowerCase('vi')
          .includes(text)) &&
      offer.price >= lower &&
      offer.price <= upper &&
      Object.entries(filters).every(
        ([group, values]) =>
          !values.length || values.includes(offerFacet(offer, group)),
      ),
  );
}
