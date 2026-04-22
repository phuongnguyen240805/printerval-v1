import { MOCK_PRODUCTS_DATABASE } from '@/lib/mockProduct';

export type RecommendedProduct = {
  id: string;
  title: string;
  handle: string;
  price: number;
  comparePrice: number | null;
  discount: number;
  image: string;
  hasCustomization: boolean;
  category: string;
};

type GetBasedOnWhatYouLoveParams = {
  currentProductId: string;
  category?: string;
  limit?: number;
};

export async function getBasedOnWhatYouLove({
  currentProductId,
  category,
  limit = 5,
}: GetBasedOnWhatYouLoveParams): Promise<RecommendedProduct[]> {
  // Lấy Recommended Products từ mock data
  const allProducts = MOCK_PRODUCTS_DATABASE;
  
  let filtered = allProducts.filter(
    (p: any) => p.id !== currentProductId && p.variants?.length > 0
  );

  // Ưu tiên cùng category nếu có
  if (category) {
    const sameCategory = filtered.filter((p: any) => p.category === category);
    if (sameCategory.length >= limit) {
      filtered = sameCategory;
    }
  }

  const recommended = filtered.slice(0, limit).map((p: any) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    price: p.variants?.[0]?.calculated_price?.calculated_amount || 0,
    comparePrice: p.variants?.[0]?.calculated_price?.original_amount || null,
    discount: calculateDiscount(
      p.variants?.[0]?.calculated_price?.original_amount,
      p.variants?.[0]?.calculated_price?.calculated_amount
    ),
    image: p.thumbnail || p.images?.[0]?.url || '/placeholder.jpg',
    hasCustomization: true,
    category: p.category || '',
  }));

  return recommended;
}

/**
 * Utility: Lấy discount percentage
 */
export function calculateDiscount(
  comparePrice: number | null | undefined,
  price: number | null | undefined
): number {
  if (!comparePrice || !price || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

/**
 * Utility: Format price để hiển thị (chia 100 vì dữ liệu lưu theo cents)
 */
export function formatPrice(price: number): string {
  return (price / 100).toFixed(2);
}


