import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL
  || "postgresql://demo:demo@localhost:5432/vemdeco";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    // `prisma generate` does not connect to this URL. The fallback lets demo
    // deployments generate the client even before a database is provisioned.
    url: databaseUrl,
  },
});
