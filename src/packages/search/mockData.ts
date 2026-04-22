// ==========================================
// MOCK DATA - Tập trung tại một chỗ
// ==========================================

export const MOCK_TRENDING = [
  "labubu",
  "bts",
  "áo thun vintage",
  "postal",
  "sticker cute"
];

export interface MockProduct {
  id: string;
  handle: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
}

export const MOCK_PICKS: MockProduct[] = [
  {
    id: "mock1",
    handle: "ao-thun-vintage-90s",
    name: "Áo thun Vintage 90s siêu cấp",
    price: 19.99,
    originalPrice: 25.00,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
  },
  {
    id: "mock2",
    handle: "Coc-su-giang-sinh-an-lanh",
    name: "Cốc sứ giáng sinh an lành",
    price: 12.50,
    originalPrice: 15.00,
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop"
  },
  {
    id: "mock3",
    handle: "tui-tote-canvas-phong-cach-han",
    name: "Túi Tote Canvas phong cách Hàn",
    price: 15.00,
    originalPrice: 20.00,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
  },
  {
    id: "mock4",
    handle: "sticker-pack-50-mieng-dan-laptop",
    name: "Sticker Pack 50 miếng dán laptop",
    price: 5.99,
    originalPrice: 9.99,
    imageUrl: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&h=400&fit=crop"
  },
  {
    id: "mock5",
    handle: "hoodie-ni-chat-luong-cao",
    name: "Hoodie Nỉ Chất Lượng Cao",
    price: 34.99,
    originalPrice: 45.00,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop"
  },
  {
    id: "mock6",
    handle: "mu-snapback-in-hinh",
    name: "Mũ Snapback In Hình",
    price: 18.99,
    originalPrice: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop"
  },
  {
    id: "mock7",
    handle: "ao-polo-nam-premium",
    name: "Áo Polo Nam Premium",
    price: 24.99,
    originalPrice: 35.00,
    imageUrl: "https://images.unsplash.com/photo-1494185872008-e2e91246ad3f?w=400&h=400&fit=crop"
  },
  {
    id: "mock8",
    handle: "quan-jean-ngan-phong-cach",
    name: "Quần Jean Ngắn Phong Cách",
    price: 28.99,
    originalPrice: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop"
  },
  {
    id: "mock9",
    handle: "vintage-vinyl-tshirt",
    name: "Vintage Vinyl Record Tee",
    price: 17.95,
    originalPrice: 29.90,
    imageUrl: "https://images.unsplash.com/photo-1494195666933-eb7efe60702e?w=400&h=400&fit=crop"
  }
];

export const MOCK_CATEGORIES = [
  { name: "T-Shirts", color: "bg-purple-700 hover:bg-purple-800" },
  { name: "Baby Onesies", color: "bg-blue-500 hover:bg-blue-600" },
  { name: "Mugs", color: "bg-green-500 hover:bg-green-600" },
  { name: "LHouse Flags", color: "bg-orange-500 hover:bg-orange-600" },
  { name: "Sweatshirts", color: "bg-red-500 hover:bg-red-600" },
  { name: "3D Hoodies", color: "bg-cyan-700 hover:bg-cyan-800" },
  { name: "Tank Tops", color: "bg-teal-400 hover:bg-teal-500" },
  { name: "Sweatshirts", color: "bg-slate-700 hover:bg-slate-800" },
  { name: "Double Sided Bab...", color: "bg-fuchsia-600 hover:bg-fuchsia-700" },
  { name: "Zip Hoodies", color: "bg-blue-600 hover:bg-blue-700" },
];


