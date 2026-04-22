import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // MOCK CART DATA
  const mockCart = {
    id: 'cart_01',
    region_id: req.body.region_id || 'reg_01',
    items: [],
    total: 0,
    currency: 'USD',
  };
  return res.status(200).json(mockCart);
}
