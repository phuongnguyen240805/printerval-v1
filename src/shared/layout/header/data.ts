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
  { id: 1, name: 'Custom T-Shirts', handle: 'custom-tshirts', product_category_image: [{ url: 'https://placehold.co/40x40/blue/white?text=T' }] },
  { id: 2, name: 'Custom Mugs', handle: 'custom-mugs', product_category_image: [{ url: 'https://placehold.co/40x40/green/white?text=M' }] },
  { id: 3, name: 'Custom Stainless Steel Tumblers', handle: 'custom-tumblers', product_category_image: [{ url: 'https://placehold.co/40x40/gray/white?text=ST' }] },
  { id: 4, name: 'Custom Ugly Sweatshirts', handle: 'custom-sweatshirts', product_category_image: [{ url: 'https://placehold.co/40x40/red/white?text=SW' }] },
  { id: 5, name: 'Custom Posters', handle: 'custom-posters', product_category_image: [{ url: 'https://placehold.co/40x40/yellow/black?text=P' }] },
  { id: 6, name: 'Custom Doormats', handle: 'custom-doormats', product_category_image: [{ url: 'https://placehold.co/40x40/brown/white?text=D' }] },
  { id: 7, name: 'Custom Metal Signs', handle: 'custom-metal-signs', product_category_image: [{ url: 'https://placehold.co/40x40/gray/black?text=MS' }] },
  { id: 8, name: 'Custom Ornaments', handle: 'custom-ornaments', product_category_image: [{ url: 'https://placehold.co/40x40/pink/white?text=O' }] },
  { id: 9, name: 'Custom Garden Flags', handle: 'custom-garden-flags', product_category_image: [{ url: 'https://placehold.co/40x40/green/white?text=GF' }] },
  { id: 10, name: 'Custom Door Signs', handle: 'custom-door-signs', product_category_image: [{ url: 'https://placehold.co/40x40/blue/white?text=DS' }] },
  { id: 11, name: 'Custom Aprons', handle: 'custom-aprons', product_category_image: [{ url: 'https://placehold.co/40x40/white/black?text=A' }] },
  { id: 12, name: 'Custom Pillows', handle: 'custom-pillows', product_category_image: [{ url: 'https://placehold.co/40x40/gray/white?text=P' }] },
];

export const blog: BlogPost[] = [
  { id: 1, Title: 'All Blog', documentId: 'all-blog' },
  { id: 2, Title: 'Gift Ideas', documentId: 'gift-ideas' }
];
