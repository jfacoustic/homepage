import { defineConfig } from "drizzle-kit";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const envName =
  process.env.npm_lifecycle_event?.endsWith(":remote") ||
  process.env.DB === "remote"
    ? "remote"
    : "local";

const wranglerDir = resolve(__dirname, ".wrangler/state/v3");
const d1Dir = resolve(wranglerDir, "d1/miniflare-D1DatabaseObject");

function getLocalDatabaseFile(): string {
  if (!existsSync(d1Dir)) {
    throw new Error(
      `Local D1 database directory not found: ${d1Dir}\n` +
        `Make sure to run this command first to initialize the local database:\n\n` +
        `pnpm wrangler d1 execute jfacoustic-db --local --command "SELECT 1"`,
    );
  }

  const sqliteFiles = readdirSync(d1Dir).filter((file) =>
    file.endsWith(".sqlite"),
  );

  if (sqliteFiles.length === 0) {
    throw new Error(
      `No SQLite database files found in: ${d1Dir}\n` +
        `Make sure to run this command first to create the local database:\n\n` +
        `pnpm wrangler d1 execute jfacoustic-db --local --command "SELECT 1"`,
    );
  }

  if (sqliteFiles.length > 1) {
    console.warn(
      `Multiple SQLite files found: ${sqliteFiles.join(", ")}. Using: ${sqliteFiles[0]}`,
    );
  }

  return sqliteFiles[0];
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `${key} environment variable is required for remote database access`,
    );
  }
  return value;
}

export default defineConfig({
  out: "./migrations",
  schema: "./app/db/schema.ts",
  dialect: "sqlite",
  casing: "snake_case",

  ...(envName === "local" && {
    dbCredentials: { url: resolve(d1Dir, getLocalDatabaseFile()) },
  }),

  ...(envName !== "local" && {
    driver: "d1-http",
    dbCredentials: {
      accountId: requireEnv("CLOUDFLARE_ACCOUNT_ID"),
      databaseId: requireEnv("CLOUDFLARE_DATABASE_ID"),
      token: requireEnv("CLOUDFLARE_D1_TOKEN"),
    },
  }),
});