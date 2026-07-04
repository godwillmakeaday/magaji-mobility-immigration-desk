// Seeds (or refreshes) the first owner account from env vars.
//   ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD, ADMIN_SEED_NAME (optional)
// Run with:  npm run db:seed
//
// Self-contained (relative imports, its own client) so it runs under tsx
// without Next's path aliases.
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { hashPassword } from "../lib/password";

if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

async function main() {
  const email = (process.env.ADMIN_SEED_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD || "";
  const name = process.env.ADMIN_SEED_NAME || "Owner";

  if (!email || !password) {
    console.error(
      "Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD before running the seed."
    );
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("ADMIN_SEED_PASSWORD must be at least 10 characters.");
    process.exit(1);
  }

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    await prisma.adminUser.update({
      where: { email },
      data: {
        passwordHash: hashPassword(password),
        role: "OWNER",
        disabled: false,
        name,
      },
    });
    console.log(`Refreshed owner account: ${email}`);
  } else {
    await prisma.adminUser.create({
      data: {
        email,
        name,
        role: "OWNER",
        passwordHash: hashPassword(password),
      },
    });
    console.log(`Created owner account: ${email}`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
