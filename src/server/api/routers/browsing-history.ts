import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// 1. Định nghĩa Interface cho bản ghi UserViewedProduct để fix lỗi 'r' và 'd'
interface ViewedProductRecord {
  id: string;
  productId: string;
  viewedAt: Date;
  userId?: string | null;
  sessionId?: string | null;
  product?: {
    name: string;
    imageUrl: string;
    price: number;
  } | null;
}

export const browsingHistoryRouter = createTRPCRouter({
  addViewedProduct: publicProcedure
    .input(z.object({
      productId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const sessionId = ctx.cookies()?.deviceSessionId;

      await ctx.db.userViewedProduct.upsert({
        where: {
          userId_productId: userId ? { userId: userId, productId: input.productId } : undefined,
        },
        update: { viewedAt: new Date() },
        create: {
          userId: userId ?? null,
          sessionId: userId ? null : sessionId,
          productId: input.productId,
        },
      });

      if (userId) {
        await pruneOldRecords(ctx.db, userId, 20);
      }
    }),

  getRecentlyViewed: publicProcedure
    .input(z.object({ limit: z.number().default(10) }).optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const sessionId = ctx.cookies()?.deviceSessionId;

      const where = userId ? { userId } : { sessionId };

      const records = await ctx.db.userViewedProduct.findMany({
        where,
        orderBy: { viewedAt: "desc" },
        take: input?.limit ?? 10,
        include: { product: true },
      });

      // FIX LỖI: Xác định kiểu cho 'r' là ViewedProductRecord
      return (records as ViewedProductRecord[]).map((r) => ({
        id: r.productId,
        name: r.product?.name,
        image_url: r.product?.imageUrl,
        url: `/product/${r.productId}`,
        price: r.product?.price,
      }));
    }),

  getRecommendations: publicProcedure
    .input(z.object({ productIds: z.array(z.string()), limit: z.number().default(4) }))
    .query(async ({ input }) => {
      return []; 
    }),
});

// FIX LỖI: Xác định kiểu cho 'db' là any (hoặc PrismaClient) và 'd' là object có id
async function pruneOldRecords(db: any, userId: string, keep: number) {
  const toDelete = await db.userViewedProduct.findMany({
    where: { userId },
    orderBy: { viewedAt: "desc" },
    skip: keep,
    select: { id: true },
  });

  if (toDelete.length > 0) {
    await db.userViewedProduct.deleteMany({
      // FIX LỖI: Xác định kiểu cho 'd'
      where: { id: { in: toDelete.map((d: { id: string }) => d.id) } },
    });
  }
}