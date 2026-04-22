import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { medusaAdmin } from "@/lib/medusaClient";

export const promotionsRoute = {
    getPromotions: publicProcedure
    .input(z.object({ promotionId: z.string() }))
    .query(async ({ input }) => {
        const response = await medusaAdmin.admin.promotion.retrieve(input.promotionId, {
            fields: "*application_method",
        });
        return response.promotion;
    })
}