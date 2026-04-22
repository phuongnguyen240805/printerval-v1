import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

/**
 * 1. CONTEXT
 * Cập nhật để có Prisma (db) và truy cập được vào request/cookies
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  return {
    // 1. Session: Thay 'null as any' bằng logic lấy session thực tế của bạn nếu có
    session: null as any, 
    
    // 2. Database: Router dùng 'ctx.db', nên ta khai báo 'db' trỏ vào prisma
    // Thay 'null as any' bằng 'prisma' thực tế của bạn (ví dụ: import { prisma } from "@/server/db")
    db: null as any, 

    // 3. Request helpers: Dùng để lấy sessionId từ cookies cho khách (Guest)
    req,
    res,
    cookies: () => req.cookies,
  };
};

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * 3. ROUTER & PROCEDURE
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/**
 * Middleware kiểm tra đăng nhập (Protected Procedure)
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);