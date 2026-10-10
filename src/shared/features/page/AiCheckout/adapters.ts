import type { AiProduct } from '../../ai-catalog/types';
import type {
  AccountDetailData,
  DetailOffer,
} from '../../ai-catalog/types';
import { periodMonths, type CheckoutItem } from './model';

export function productCheckout(
  product: AiProduct,
  price = product.price,
  title = product.name,
): CheckoutItem {
  const marketplace = product.type === 'marketplace';
  return {
    id: `${product.id}:${title}:${price}`,
    name: product.name,
    title,
    logo: product.logo,
    price,
    currencyCode: product.currencyCode,
    periodMonths: periodMonths(marketplace ? title : product.duration),
    access: marketplace ? title : 'Gói tiêu chuẩn',
    seller: marketplace ? 'Thị trường' : undefined,
    oneTime: product.id.includes('recharge'),
  };
}

export function offerCheckout(
  data: AccountDetailData,
  offer: DetailOffer,
): CheckoutItem {
  return {
    id: offer.id,
    name: data.name,
    title: offer.title,
    logo: data.logo,
    price: offer.price,
    currencyCode: offer.currencyCode,
    periodMonths: periodMonths(offer.duration),
    access: offer.sharing,
    seller: offer.seller,
    warranty: offer.warranty,
  };
}
