import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma best-practice for pgBouncer on serverless:
//   connection_limit=1  — one connection per function instance (Supabase hobby cap: 3)
//   pool_timeout=0      — disable Prisma's 10s pool wait; pgBouncer handles timeouts
function buildDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connection_limit=1&pool_timeout=0`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasourceUrl: buildDatasourceUrl(),
  });

globalForPrisma.prisma = db;
