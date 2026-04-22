// hooks/useRelatedSearches.ts

export type RelatedSearchItem = {
  label: string;
  href: string;
  image?: string;
  type: 'category' | 'style' | 'color' | 'gender' | 'keyword';
};

export function useRelatedSearches(currentProduct: any) {
  const items: RelatedSearchItem[] = [];

  if (!currentProduct) return { relatedItems: [] };

  // ==================== LOGIC CHUNG ====================

  // 1. Category based
  if (currentProduct.category) {
    items.push({
      label: "T-Shirts",
      href: "/t-shirts",
      type: 'category'
    });

    items.push({
      label: "Shirts & Tops",
      href: "/shirts",
      type: 'category'
    });
  }

  // 2. Style based
  if (currentProduct.style) {
    const styleSlug = currentProduct.style
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    items.push({
      label: currentProduct.style,
      href: `/collections/${styleSlug}`,
      type: 'style'
    });
  }

  // 3. Color based
  if (currentProduct.color) {
    items.push({
      label: currentProduct.color,
      href: `/t-shirts?color=${currentProduct.color.toLowerCase()}`,
      type: 'color'
    });
  }

  // 4. Gender / Target
  if (currentProduct.gender || currentProduct.target === 'men' || currentProduct.title?.toLowerCase().includes('men')) {
    items.push({
      label: "Men",
      href: "/t-shirts?gender=men",
      type: 'gender'
    });
  }

  // 5. Custom related (luôn hiển thị nếu là áo thun)
  if (currentProduct.metadata?.supports_customization || currentProduct.title?.toLowerCase().includes('custom')) {
    items.push({
      label: "Custom T-Shirts",
      href: "/custom-t-shirts",
      type: 'keyword'
    });
  }

  // 6. Một số keyword cố định hữu ích
  items.push({
    label: "Clothing",
    href: "/clothing",
    type: 'category'
  });

  // Loại bỏ trùng lặp (nếu có)
  const uniqueItems = items.filter((item, index, self) =>
    index === self.findIndex(i => i.label === item.label)
  );

  return {
    relatedItems: uniqueItems,
  };
}

