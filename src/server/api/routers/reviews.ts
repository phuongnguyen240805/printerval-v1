// src/server/api/routers/reviews.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const reviewsRouter = createTRPCRouter({
  getRatingCount: publicProcedure
    .input(z.object({ targetId: z.string(), target: z.enum(['PRODUCT', 'SHOP']) }))
    .query(async ({ ctx, input }) => {
      const where = input.target === 'PRODUCT'
        ? { targetId: input.targetId, targetType: 'PRODUCT', status: 'ACTIVE' }
        : { targetId: input.targetId, targetType: 'SHOP', status: 'ACTIVE' };

      const counts = await ctx.prisma.comment.groupBy({
        by: ['rating'],
        where,
        _count: { rating: true },
      });

      const result = Array.from({ length: 5 }, (_, i) => {
        const rating = 5 - i;
        const found = counts.find((c) => c.rating === rating);
        return { rating, count: found?._count.rating ?? 0, percent: 0 };
      });

      const total = result.reduce((sum, r) => sum + r.count, 0);
      result.forEach((r) => (r.percent = total ? Math.round((r.count / total) * 100) : 0));
      const avg = total ? result.reduce((sum, r) => sum + r.rating * r.count, 0) / total : 0;

      return { counts: result, avg: avg.toFixed(1), total };
    }),

  getComments: publicProcedure
    .input(
      z.object({
        targetId: z.string(),
        target: z.enum(['PRODUCT', 'SHOP']),
        page: z.number().default(0),
        pageSize: z.number().default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = input.target === 'PRODUCT'
        ? { targetId: input.targetId, targetType: 'PRODUCT', status: 'ACTIVE', parentId: null }
        : { targetId: input.targetId, targetType: 'SHOP', status: 'ACTIVE', parentId: null };

      const comments = await ctx.prisma.comment.findMany({
        where,
        orderBy: [{ isPin: 'desc' }, { sortId: 'desc' }, { createdAt: 'desc' }],
        take: input.pageSize,
        skip: input.page * input.pageSize,
        include: { replies: { take: 3 } }, // ví dụ lấy 3 reply đầu
      });

      const total = await ctx.prisma.comment.count({ where });

      return {
        comments,
        meta: { pageCount: Math.ceil(total / input.pageSize), total },
      };
    }),

  storeComment: publicProcedure // hoặc protected nếu muốn bắt buộc login
    .input(
      z.object({
        fullName: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email'),
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(10, 'Content too short'),
        rating: z.number().int().min(1).max(5).optional(),
        images: z.array(z.string()).optional(),
        targetId: z.string(),
        targetType: z.enum(['PRODUCT', 'SHOP']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          content: input.content,
          rating: input.rating,
          images: input.images ? JSON.stringify(input.images) : undefined,
          targetId: input.targetId,
          targetType: input.targetType,
          status: 'PENDING',
        },
      });
    }),
});