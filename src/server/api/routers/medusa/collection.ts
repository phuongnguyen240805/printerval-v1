import { publicProcedure } from "../../trpc";
import { medusaClient } from "@/lib/medusaClient";

export const collectionRouter = {
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
