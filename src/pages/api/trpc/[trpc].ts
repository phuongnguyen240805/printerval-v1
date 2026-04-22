import type { NextApiRequest, NextApiResponse } from 'next';

import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createTRPCContext } from '@/server/api/trpc';
import { appRouter } from '@/server/api/root';
// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
          );
        }
      : undefined,
});

// MOCK tRPC handler trả về đúng format batch cho FE
// import type { NextApiRequest, NextApiResponse } from 'next';
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Nếu là batch request (input là object với nhiều keys)
//   if (req.method === 'GET' && req.url?.includes('batch=1')) {
//     // Trả về mảng các object { result: { data: ... } }
//     return res.status(200).json([
//       { result: { data: { regions: [{ id: 'reg_01', name: 'US', currency: 'USD' }] } } },
//       { result: { data: { products: [{ id: 'p1', title: 'Mock Product' }] } } },
//       { result: { data: { priceList: [] } } },
//       { result: { data: { video: null } } }
//     ]);
//   }
//   // Nếu là request đơn lẻ
//   return res.status(200).json({ result: { data: { mock: true } } });
// }
