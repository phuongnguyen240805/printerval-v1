// src/routers/medusa/campaignRouter.ts
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { medusaAdmin, medusaClient } from "@/lib/medusaClient";
import { get } from "http";


export const categoriesRouter = {
  listCategories: publicProcedure // ← đổi thành protectedProcedure khi có auth
    .query(async () => {
      try {
        const response = await medusaClient.store.category.list({
          fields: "+*products",
        });
        return response.product_categories; // hoặc response.data tùy phiên bản
      } catch (err: any) {
        console.error("Category fetch error:", {
          status: err?.response?.status,
          message: err?.message,
          data: err?.response?.data,
        });
        throw new Error("Failed to fetch categories");
      }
    }),
  getCategory: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        // ✅ Gọi /admin/campaigns/:id
        const response = await medusaClient.store.category.retrieve(input.id);
        return response; // hoặc response.data tùy phiên bản
      } catch (err: any) {
        console.error("Category fetch error:", {
          status: err?.response?.status,
          message: err?.message,
          data: err?.response?.data,
        });
        throw new Error("Failed to fetch category");
      }
    }),
};