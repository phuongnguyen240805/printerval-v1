export interface NavLink {
  name: string;
  href: string;
  collapsible?: boolean;
}

export interface Campaign {
  id: number;
  name: string;
  Title: string;
  description: string;
  slug?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  handle: string;
  product_category_image: Array<{ url: string }>;
}

export interface BlogPost {
  id: number;
  Title: string;
  documentId: string;
}

export const navLinks: NavLink[] = [
  { name: 'Create Your Own', href: '/create-your-own' },
  { name: 'Order Tracking', href: '/order-tracking' },
  { name: "Happy New Year", href: '/happy-new-year' },
  { name: 'Product', href: '/product', collapsible: true },
  { name: 'Explore Designs', href: '/designs' },
  { name: "Free E-Cart", href: '/free-ecart' },
  { name: 'Blog', href: '/blog', collapsible: true },
];

export const campaign: Campaign[] = [
  { id: 1, name: 'Spring Sale', Title: 'Spring Sale - Up to 60% off!', description: 'Up to 60% off!', slug: '/happy-new-year' },
  { id: 2, name: 'St. Patrick Day', Title: 'St. Patricks Day Sales', description: 'Exclusive deals for St. Patricks Day', slug: '/happy-new-year' },
  { id: 3, name: 'Holiday Special', Title: 'Holiday Special Offers', description: 'Great savings on holiday items', slug: '/happy-new-year' }
];

export const categories: ProductCategory[] = [
  { id: 13, name: 'Tài khoản AI', handle: 'tai-khoan-ai', product_category_image: [{ url: '/assets/ai-accounts/chatgpt.webp' }] },
  { id: 1, name: 'Custom T-Shirts', handle: 'custom-tshirts', product_category_image: [{ url: '/assets/clothes.webp' }] },
  { id: 2, name: 'Custom Mugs', handle: 'custom-mugs', product_category_image: [{ url: '/assets/mug.webp' }] },
  { id: 3, name: 'Custom Stainless Steel Tumblers', handle: 'custom-tumblers', product_category_image: [{ url: '/assets/accessories.webp' }] },
  { id: 4, name: 'Custom Ugly Sweatshirts', handle: 'custom-sweatshirts', product_category_image: [{ url: '/assets/clothes.webp' }] },
  { id: 5, name: 'Custom Posters', handle: 'custom-posters', product_category_image: [{ url: '/assets/home.webp' }] },
  { id: 6, name: 'Custom Doormats', handle: 'custom-doormats', product_category_image: [{ url: '/assets/home.webp' }] },
  { id: 7, name: 'Custom Metal Signs', handle: 'custom-metal-signs', product_category_image: [{ url: '/assets/home.webp' }] },
  { id: 8, name: 'Custom Ornaments', handle: 'custom-ornaments', product_category_image: [{ url: '/assets/accessories.webp' }] },
  { id: 9, name: 'Custom Garden Flags', handle: 'custom-garden-flags', product_category_image: [{ url: '/assets/home.webp' }] },
  { id: 10, name: 'Custom Door Signs', handle: 'custom-door-signs', product_category_image: [{ url: '/assets/home.webp' }] },
  { id: 11, name: 'Custom Aprons', handle: 'custom-aprons', product_category_image: [{ url: '/assets/clothes.webp' }] },
  { id: 12, name: 'Custom Pillows', handle: 'custom-pillows', product_category_image: [{ url: '/assets/home.webp' }] },
];

export const blog: BlogPost[] = [
  { id: 1, Title: 'All Blog', documentId: 'all-blog' },
  { id: 2, Title: 'Gift Ideas', documentId: 'gift-ideas' }
];

// Standalone FE clone: keep Printerval Header/Footer and expose the cloned content from Categories.
if (!categories.some((item) => item.handle === 'mau-hop-dong')) {
  categories.unshift({
    id: -100,
    name: 'Mẫu hợp đồng',
    handle: 'mau-hop-dong',
    product_category_image: [{ url: '/mau-hop-dong/category-contract.svg' }],
  });
}
