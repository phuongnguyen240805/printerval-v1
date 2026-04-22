import type { NextApiRequest, NextApiResponse } from 'next';

// MOCK DATA
const mockRegions = [
  { id: 'reg_01', name: 'US', currency: 'USD' },
  { id: 'reg_02', name: 'VN', currency: 'VND' },
];
const mockProducts = [
  { id: 'p1', title: 'Anytime Fitness T-Shirt', price: 12.95 },
  { id: 'p2', title: 'Bonecrusher Skull Hoodie', price: 14.95 },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mock regions endpoint
  if (req.url?.includes('/regions')) {
    return res.status(200).json({ regions: mockRegions });
  }
  // Mock product endpoint
  if (req.url?.includes('/product')) {
    return res.status(200).json({
      products: mockProducts,
      count: mockProducts.length,
      offset: 0,
      limit: mockProducts.length,
    });
  }
  // Default mock response
  return res.status(200).json({ message: 'Mock API route', url: req.url });
}