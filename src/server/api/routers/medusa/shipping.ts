import { medusaAdmin } from "@/lib/medusaClient";
import { publicProcedure } from "../../trpc";

export const shippingRoute = {
  getShippingOptions: publicProcedure.query(async () => {
    try {
      const response = await medusaAdmin.admin.shippingOption.list();
        return response.shipping_options;
    } catch (err: any) {
      console.error("Shipping options fetch error:", {
        status: err?.response?.status,
        message: err?.message,
        data: err?.response?.data,
      });
      throw new Error("Failed to fetch shipping options");
    }
  }),
};