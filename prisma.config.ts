import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7 moves the Migrate/introspect connection URL out of schema.prisma and
// into this config. The runtime connection is handled separately by the Neon
// driver adapter in lib/prisma.ts. DATABASE_URL is only needed for the
// `prisma migrate` / `prisma db` CLI commands, not for `prisma generate`.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
