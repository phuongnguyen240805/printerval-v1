import { createTRPCRouter } from './trpc';
import { medusaRouter } from './routers/medusa';
import { strapiRouter } from './routers/blog';
import { searchRouter } from './routers/search.router';
import { browsingHistoryRouter } from './routers/browsing-history';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  search: searchRouter,
  medusa: medusaRouter,
  blog: strapiRouter,
  browsingHistory: browsingHistoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
