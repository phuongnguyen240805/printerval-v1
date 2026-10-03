import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { medusaClient } from "@/lib/medusaClient";

export const regionRouter = {
  // Get all regions
  getRegions: publicProcedure.query(async () => {
    try {
      const { regions } = await medusaClient.store.region.list();

      if(!regions) return [];

      return regions;
    } catch {
      // Browsing remains available when the commerce backend is offline.
      // Do not invent region IDs that could later be submitted to checkout.
      return [];
    }
  }),

  // Get region by ID
  getRegion: publicProcedure
    .input(
      z.object({
        regionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { region } = await medusaClient.store.region.retrieve(input.regionId);
        return region;
      } catch (err) {
        console.error("Medusa region fetch error:", err);
        throw new Error("Failed to fetch region from Medusa");
      }
    }),
};
