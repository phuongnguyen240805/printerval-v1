// src/server/api/routers/bought-together.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const boughtTogetherRouter = createTRPCRouter({
  findSuggestions: publicProcedure
    .input(z.object({
      productId: z.string(),
      limit: z.number().default(10),
      abTesting: z.boolean().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Logic giống API cũ: query DB hoặc recommendation service
      const suggestions = await ctx.prisma.boughtTogetherSuggestion.findMany({
        where: { mainProductId: input.productId },
        take: input.limit,
        include: { suggested: { include: { variants: true } } },
      });

      // Map data giống format cũ (price, high_price, variant_default, print_locations...)
      return suggestions.map(s => ({
        id: s.suggested.id,
        name: s.suggested.name,
        price: s.suggested.price,
        high_price: s.suggested.highPrice,
        image_url: s.suggested.imageUrl,
        variant_default: s.suggested.variants.filter(v => v.isDefault), // giả sử
        attributes: { print_locations: [...] }, // map từ config
        is_custom_design: s.suggested.isCustomDesign ?? false,
        // ... thêm fields cần
      }));
    }),

  addAllToCart: protectedProcedure // hoặc public nếu guest ok
    .input(z.object({
      mainProductId: z.string(),
      items: z.array(z.object({
        productId: z.string(),
        productSkuId: z.string().optional(),
        quantity: z.number().default(1),
        configurations: z.string().optional(), // JSON print_location, discounts...
        productVariantOptions: z.string().optional(),
      })),
      token: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Validate items active
      // Tạo order items trong DB hoặc gọi cart service
      // Trả về cart result + related products (upsell)
      const cartItems = await ctx.prisma.cartItem.createMany({
        data: input.items.map(item => ({
          userId: ctx.session.user.id,
          productId: item.productId,
          variantId: item.productSkuId,
          quantity: item.quantity,
          configurations: item.configurations,
        })),
      });

      // Optional: tính total price, discount, related products
      return { status: 'successful', result: cartItems, relatedProducts: [] };
    }),

  // Thêm mutation cho change variant/print location nếu cần lưu server-side
});