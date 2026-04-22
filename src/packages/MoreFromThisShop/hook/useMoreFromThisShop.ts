// hooks/useMoreFromThisShop.ts
import { MOCK_PRODUCTS_DATABASE } from '@/lib/mockProduct';

export function useMoreFromThisShop(currentProductId: string, limit: number = 4) {
  const currentProduct = MOCK_PRODUCTS_DATABASE.find(p => p.id === currentProductId);
  
  if (!currentProduct?.sellerId) {
    return { 
      products: [], 
      shopName: '', 
      sellerId: null 
    };
  }

  const shopProducts = MOCK_PRODUCTS_DATABASE
    .filter(p => 
      p.sellerId === currentProduct.sellerId && 
      p.id !== currentProductId
    )
    .slice(0, limit);

  return {
    products: shopProducts,
    shopName: currentProduct.seller?.name || 'This Shop',
    sellerId: currentProduct.sellerId,
  };
}

