import { useMemo } from 'react';

type Product = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  category?: string;        // ví dụ: "comfort-colors", "heavyweight", "oversized"
  tags?: string[];          // ví dụ: ["white", "black", "vintage", "cotton"]
  style?: string;           // "Heavyweight T-shirt", "Premium T-shirt"
  color?: string;
};

type UseYouMightLoveTheseProps = {
  currentProduct: Product;           // Truyền nguyên object sản phẩm hiện tại
  allProducts: Product[];
  limit?: number;
};

export function useYouMightLoveThese({
  currentProduct,
  allProducts,
  limit = 8,
}: UseYouMightLoveTheseProps) {

  const recommendedProducts = useMemo(() => {
    if (!allProducts?.length || !currentProduct) return [];

    let scoredProducts = allProducts
      .filter(p => p.id !== currentProduct.id)   // Loại bỏ chính nó
      .map(product => {
        let score = 0;

        // 1. Logic chính: Cùng category / style (trọng số cao nhất)
        if (product.category && product.category === currentProduct.category) {
          score += 40;
        }
        if (product.style && product.style === currentProduct.style) {
          score += 30;
        }

        // 2. Cùng màu / tag (rất quan trọng với áo thun)
        if (product.color && product.color === currentProduct.color) {
          score += 20;
        }
        if (product.tags && currentProduct.tags) {
          const commonTags = product.tags.filter(tag => 
            currentProduct.tags!.includes(tag)
          );
          score += commonTags.length * 8;
        }

        // 3. Giá gần tương đương (không quá rẻ hoặc quá đắt)
        const priceDiff = Math.abs(product.price - currentProduct.price);
        if (priceDiff < 10) score += 15;
        else if (priceDiff < 20) score += 8;

        // 4. Bonus cho best seller (nếu sau này bạn thêm trường isBestSeller)
        // if (product.isBestSeller) score += 10;

        return { ...product, score };
      });

    // Sắp xếp theo điểm số giảm dần
    scoredProducts.sort((a, b) => b.score - a.score);

    return scoredProducts.slice(0, limit);
  }, [currentProduct, allProducts, limit]);

  return {
    recommendedProducts,
    hasRecommendations: recommendedProducts.length > 0,
  };
}

