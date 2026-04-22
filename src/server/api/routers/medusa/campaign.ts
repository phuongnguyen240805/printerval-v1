// src/routers/medusa/campaignRouter.ts
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { medusaAdmin } from "@/lib/medusaClient";


export const campaignRouter = {
  listCampaigns: publicProcedure // ← đổi thành protectedProcedure khi có auth
    .query(async () => {
      try {
        // ✅ Gọi /admin/campaigns
        const response = await medusaAdmin.admin.campaign.list({
          fields: "*promotions"
        });
        return response.campaigns; // hoặc response.data tùy phiên bản
      } catch (err: any) {
        console.error("Campaign fetch error:", {
          status: err?.response?.status,
          message: err?.message,
          data: err?.response?.data,
        });
        throw new Error("Failed to fetch campaigns");
      }
    }),

  // (Tùy chọn) Lấy campaign theo ID
  getCampaignById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const response = await medusaAdmin.admin.campaign.retrieve(input.id);
      return response.campaign;
    }),
};