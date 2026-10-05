import { publicProcedure } from "../../trpc";
import { medusaClient } from "@/lib/medusaClient";
import { z } from "zod";
import type { HttpTypes } from "@medusajs/types";

export const collectionRouter = {
  getCollectionCatalog: publicProcedure
    .input(z.object({ regionID: z.string().optional() }))
    .query(async ({ input }) => {
      // Fetch every page: category counts and price sorting must use the full catalog.
      const products: HttpTypes.StoreProduct[] = [];
      const categories: HttpTypes.StoreProductCategory[] = [];
      await Promise.all([
        (async () => {
          let count = Infinity;
          while (products.length < count) {
            const page = await medusaClient.store.product.list({
              limit: 100, offset: products.length, region_id: input.regionID,
              order: "-created_at",
              fields: "id,title,handle,thumbnail,created_at,metadata,*categories,*variants.calculated_price",
            });
            products.push(...page.products);
            count = page.count;
            if (!page.products.length) break;
          }
        })(),
        (async () => {
          let count = Infinity;
          while (categories.length < count) {
            const page = await medusaClient.store.category.list({ limit: 100, offset: categories.length });
            categories.push(...page.product_categories);
            count = page.count;
            if (!page.product_categories.length) break;
          }
        })(),
      ]);
      return { products, categories };
    }),
  getCollections: publicProcedure.query(async () => {
     try {
    const  {collections}  = await medusaClient.store.collection.list({
      fields: "*metadata"
    });
    return collections;
  } catch (err) {
    console.error("Medusa fetch error:", err);
    throw new Error("Failed to fetch collections from Medusa");
  }
  }),
}
