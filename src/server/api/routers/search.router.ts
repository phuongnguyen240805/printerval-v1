import { createTRPCRouter, publicProcedure } from "../trpc";
import { subDays } from "date-fns";

export const searchRouter = createTRPCRouter({
  // 1. API lấy Trending Searches
  getTrending: publicProcedure.query(async ({ ctx }) => {
    const fromDate = subDays(new Date(), 7); // Lấy data 7 ngày gần nhất

    const trending = await ctx.prisma.searchLog.groupBy({
      by: ['term'],
      where: { createdAt: { gte: fromDate } },
      _count: { term: true },
      orderBy: { _count: { term: 'desc' } },
      take: 5, // Lấy top 5 từ khóa
    });

    // Trả về một mảng các string ['labubu', 'bts', ...]
    return trending.map((t: { term: string }) => t.term);
  }),

  // 2. API lấy Today's Special Picks (Sản phẩm Hot)
  getSpecialPicks: publicProcedure.query(async ({ ctx }) => {
    const fromDate = subDays(new Date(), 1); // Lấy data 1 ngày (Today)

    // Bước 1: Lấy danh sách ID đã được sắp xếp theo lượt click nhiều nhất
    const topProductIds = await ctx.prisma.productTracking.groupBy({
      by: ['productId'],
      where: { 
        type: 'CLICK', 
        createdAt: { gte: fromDate } 
      },
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 8, // Lấy 8 sản phẩm
    });

    // Nếu hôm nay chưa có ai click gì, trả về mảng rỗng để không bị lỗi truy vấn
    if (topProductIds.length === 0) return [];

// Bước 2: Truy vấn chi tiết sản phẩm từ mảng ID vừa tìm được
    const products = await ctx.prisma.product.findMany({
      // Ép kiểu rõ ràng cho p ở đây nè má!
      where: { id: { in: topProductIds.map((p: { productId: string }) => p.productId) } },
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        imageUrl: true,
      }
    });

    // Bước 3: Sắp xếp lại danh sách sản phẩm theo đúng thứ tự Hot nhất ở Bước 1
    // (Vì findMany với `in` không giữ nguyên thứ tự truyền vào)
  const sortedProducts = topProductIds.flatMap((tracking: { productId: string }) => {
        // Ép kiểu p có chứa id là string (nếu database id của bạn là số thì đổi thành number nhé)
        const product = products.find((p: { id: string }) => p.id === tracking.productId);
        
        // Nếu tìm thấy, trả về mảng 1 phần tử. Nếu không thấy, trả về mảng rỗng.
        return product ? [product] : [];
      });

      return sortedProducts;
  
  }),
});