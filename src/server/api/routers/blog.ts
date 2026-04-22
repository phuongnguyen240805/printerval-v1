import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { strapiClient } from '@/lib/strapi-client';

interface StrapiResponse<T = unknown> {
    data?: T;
}

// Helper đơn giản: response từ @strapi/client luôn có .data
const getData = <T>(res: StrapiResponse<T>) => res?.data ?? null;

export const strapiRouter = createTRPCRouter({ 
    getCollections: publicProcedure
        .query(async () => {
            const response = await strapiClient.collection('/blogs').find({ populate: '*'});
            return getData(response);
        }
    ),
    getBlog: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
            const response = await strapiClient.collection('/blogs').find({
                filters: { slug: input.slug },
                populate: '*',
            });
            const data = getData(response);
            return data?.[0] ?? null;
        }
    ),
    getCategories: publicProcedure
        .query(async () => {
            const response = await strapiClient.collection('/collections').find({ populate: '*'});
            return getData(response);
        }
    ),
});