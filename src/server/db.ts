
import { PrismaClient } from "@prisma/client";

// Khai báo biến global để lưu trữ Prisma (chỉ dùng cho môi trường Dev)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Khởi tạo kết nối Prisma
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Tránh việc tạo quá nhiều kết nối khi hot-reload (Ctrl+S) trong lúc Dev
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;