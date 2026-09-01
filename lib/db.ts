import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// On Vercel serverless each function instance needs only 1 DB connection.
// Appending connection_limit=1 prevents exhausting Supabase's pool (limit: 3).
function buildDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connection_limit=1`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasourceUrl: buildDatasourceUrl(),
  });

globalForPrisma.prisma = db;
