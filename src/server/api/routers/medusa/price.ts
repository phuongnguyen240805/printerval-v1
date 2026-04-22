import { medusaAdmin } from "@/lib/medusaClient";
import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { get } from "http";

const MEDUSA_BASE =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export const priceRoute = {
    getPriceList: publicProcedure.query(async ({}) => {
        const price = await medusaAdmin.admin.priceList.list();
        return price;
    }),

    getPrice: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
                const price = await medusaAdmin.admin.priceList.retrieve(input.id, {
                     fields: "id,*prices"
                });
                return price;
    }),

    getSaleProducts: publicProcedure
        .input(z.object({ regionID: z.string().optional() }))
        .query(async ({ input }) => {
        const { regionID } = input;

        try {
        const productRes = await fetch(
            `${MEDUSA_BASE}/store/products?region_id=${regionID}&fields=*variants.calculated_price`,
            {
            headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
            }
        );

        const { products } = await productRes.json();

        // Lọc sản phẩm có ít nhất một variant với giá sale
        const saleProducts = products.filter((product: any) =>
            product.variants?.some(
            (v: any) =>
                v.calculated_price?.calculated_price?.price_list_type === "sale"
            )
        );

        return saleProducts;
        } catch (error) {
        console.error("Error fetching sale products:", error);
        return [];
        }
    }),
}