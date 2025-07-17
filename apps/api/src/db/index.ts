import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Initialize the SQLite database connection
const sqlite = new Database("sweet-shop.db");

// Create a Drizzle ORM instance with our schema
export const db = drizzle(sqlite, { schema });
// Export the schema for usage elsewhere in the application
export { schema };
