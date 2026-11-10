import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Resilient helper to execute database operations with automatic retry
 * on transient serverless cold-start or connection wake-up errors.
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 1500
): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      const isConnectionError =
        err?.message?.includes("Can't reach database server") ||
        err?.message?.includes("connection pool") ||
        err?.message?.includes("Connection refused") ||
        err?.message?.includes("Closed connection") ||
        err?.message?.includes("Connection terminated");

      if (attempt <= retries && isConnectionError) {
        console.warn(`[Neon Serverless] Wake-up in progress. Retrying in ${delayMs}ms (attempt ${attempt}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Database operation failed after retries.");
}
