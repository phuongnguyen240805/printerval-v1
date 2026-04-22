import { useEffect } from 'react';

export type RecentlyViewedItem = {
  id: string;
  name: string;
  image_url: string;
  url: string;
  price: string;
  compare_at_price?: string;
  handle: string;
  viewedAt: number;
};

const STORAGE_KEY = 'recently_viewed_products';
const MAX_ITEMS = 20;

/**
 * Hook để quản lý Recently Viewed Products trong localStorage
 */
export function useRecentlyViewed() {
  /**
   * Lưu sản phẩm vào recently viewed
   */
  const addViewedProduct = (product: Omit<RecentlyViewedItem, 'viewedAt'>) => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const items: RecentlyViewedItem[] = stored ? JSON.parse(stored) : [];

      // Xóa sản phẩm nếu đã tồn tại (để đưa lên đầu)
      const filtered = items.filter(item => item.id !== product.id);

      // Thêm sản phẩm mới lên đầu
      const updated = [
        { ...product, viewedAt: Date.now() },
        ...filtered
      ].slice(0, MAX_ITEMS); // Giới hạn 20 items

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Emit event để các component khác biết
      window.dispatchEvent(
        new CustomEvent('recently-viewed-updated', { detail: updated })
      );
    } catch (error) {
      console.error('Error saving recently viewed:', error);
    }
  };

  /**
   * Lấy danh sách recently viewed products
   */
  const getRecentlyViewed = (): RecentlyViewedItem[] => {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading recently viewed:', error);
      return [];
    }
  };

  /**
   * Xóa một sản phẩm khỏi danh sách
   */
  const removeViewedProduct = (productId: string) => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const items: RecentlyViewedItem[] = stored ? JSON.parse(stored) : [];
      const updated = items.filter(item => item.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      window.dispatchEvent(
        new CustomEvent('recently-viewed-updated', { detail: updated })
      );
    } catch (error) {
      console.error('Error removing recently viewed:', error);
    }
  };

  /**
   * Xóa tất cả
   */
  const clearRecentlyViewed = () => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent('recently-viewed-updated', { detail: [] })
      );
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  return {
    addViewedProduct,
    getRecentlyViewed,
    removeViewedProduct,
    clearRecentlyViewed,
  };
}


