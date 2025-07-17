import { defineConfig, type Config } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:sweet-shop.db", // Path to your SQLite database file
  },
}) satisfies Config;
