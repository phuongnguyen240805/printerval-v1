import z from "zod";
import { publicProcedure } from "../../trpc";
import { medusaClient } from "@/lib/medusaClient";

export const cartRouter = {
  createCart: publicProcedure.input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    // Logic to create a cart using Medusa client
    const response = await medusaClient.store.cart.create({region_id: input.id})
    return response;
  }),
  getCart: publicProcedure.input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    // Logic to get a cart using Medusa client
    const response = await medusaClient.store.cart.retrieve(input.id)
    return response;
  }),
  addToCart: publicProcedure.input(z.object({ cart_id: z.string(), variant_id: z.string(), quantity: z.number() }))
  .mutation(async ({ input }) => {
    // Logic to add item to cart using Medusa client
    const response = await medusaClient.store.cart.createLineItem(input.cart_id, {
      variant_id: input.variant_id,
      quantity: input.quantity,
    });
    return response;
  }),
  deleterFromCart: publicProcedure
  .input(z.object({
    cart_id: z.string(),
    line_item_id: z.string(),
  }))
  .mutation(async ({ input }) => {
    const response = await medusaClient.store.cart.deleteLineItem(
      input.cart_id,
      input.line_item_id
    )
    return response
  }),
}