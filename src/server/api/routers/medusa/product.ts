import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { medusaAdmin, medusaClient } from "@/lib/medusaClient";

// Lưu ý: Thay đổi kiểu dữ liệu ProductWithBuilder nếu bạn không dùng Builder nữa
// Hoặc sử dụng kiểu mặc định của Medusa để an toàn nhất.

export const productRouter = {
  // 1. Lấy danh sách tất cả sản phẩm
  getProducts: publicProcedure
    .input(
      z.object({ 
        regionID: z.string().optional(), 
        collection_id: z.string().optional() 
      }).optional() // Fix lỗi "Required" khi không truyền input
    )
    .query(async ({ input }) => {
      try {
        const { products } = await medusaClient.store.product.list({
          limit: 20,
          // Đã loại bỏ product_builder để tránh lỗi 500 ở Backend v2
          fields: "id,title,thumbnail,handle,status,*variants,*variants.calculated_price",
          region_id: input?.regionID,
          collection_id: input?.collection_id,
        });
        return products;
      } catch (err) {
        console.error("Medusa fetch error:", err);
        throw new Error("Failed to fetch products from Medusa");
      }
    }),

  // 2. Lấy chi tiết một sản phẩm cụ thể theo ID hoặc Handle
  getProduct: publicProcedure
    .input(z.object({ 
      id: z.string().optional(), 
      handle: z.string().optional(),
      regionID: z.string().optional()
     }))
    .query(async ({ input }) => {
      try {
        let medusaProduct;

        if(input.id) {
            const { product } = await medusaClient.store.product.retrieve(input.id, {
            fields: "id,title,description,thumbnail,handle,status,*variants,*variants.calculated_price,*options,*options.values,*images",
            region_id: input.regionID,
          });
          medusaProduct = product;
        } else if(input.handle) {
          const { products } = await medusaClient.store.product.list({
            handle: input.handle,
            region_id: input.regionID,
            fields: [
    "id",
    "handle",
    "title",
    "description",
    "thumbnail",
    "weight",
    "created_at",
    "metadata",
    "*images",
    "*variants",
    "*variants.calculated_price",
    "*options",
    "*options.values",
  ].join(","),
          });
          if (!products.length) throw new Error("Product not found");
          medusaProduct = products[0];
        }

        // 2. TRANSFORM DATA: Chỉnh sửa để giống format yêu cầu
      return medusaProduct
      } catch (err) {
        console.error("Medusa fetch error:", err);
        throw new Error("Product not found");
      }
    }),

  // 3. Lấy danh sách sản phẩm đã xem gần đây (Recently Viewed)
  getProductRecent: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()), // Nhận mảng ID sản phẩm
        regionID: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        if (!input.ids.length) return [];
        
        const { products } = await medusaClient.store.product.list({
          id: input.ids,
          limit: 20,
          fields: "id,title,thumbnail,*variants,*variants.calculated_price,*variants.prices",
          region_id: input.regionID,
        });
        return products;
      } catch (err) {
        console.error("Medusa fetch error:", err);
        return [];
      }
    }),

  // 4. Lấy sản phẩm đang giảm giá (Price List) - Sử dụng Admin SDK
  getProductSales: publicProcedure
    .input(z.object({ price_list_id: z.string() }))
    .query(async ({ input: { price_list_id } }) => {
      try {
        const { products } = await medusaAdmin.admin.product.list({
          price_list_id: [price_list_id],
        });
        return products;
      } catch (err) {
        console.error("Error fetching sales products:", err);
        return [];
      }
    }),

  // 5. Tính toán giá tùy chỉnh cho Variant
  getPriceCustom: publicProcedure
    .input(
      z.object({
        variant_id: z.string(),
        region_id: z.string(),
        metadata: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { variant_id, region_id, metadata } = input;
      const { price } = await medusaClient.client.fetch<{ price: number }>(
        `/store/variant/${variant_id}/price`,
        {
          method: "POST",
          body: {
            region_id,
            metadata,
          },
          cache: "no-cache",
        }
      );
      return price;
    }),

  // 6. Lấy danh sách sản phẩm số (Digital Products)
  getDigitalProduct: publicProcedure.query(async () => {
    try {
      const { digital_products } = await medusaAdmin.client.fetch<{ digital_products: any }>(
        `admin/digital-products`
      );
      return digital_products;
    } catch (err) {
      console.error("Digital product error:", err);
      return [];
    }
  }),

  // 7. Lấy sản phẩm được cá nhân hóa theo Category
  getProductPersonalized: publicProcedure
    .input(z.object({ categories_id: z.string() }))
    .query(async ({ input }) => {
      try {
        const { products } = await medusaClient.client.fetch<{ products: any }>(
          'store/personalized-products',
          {
            query: {
              category_id: input.categories_id
            }
          }
        );
        return products;
      } catch (err) {
        console.error("Personalized product error:", err);
        return [];
      }
    })
};