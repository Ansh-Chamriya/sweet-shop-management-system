// Export all schema definitions
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// This schema defines the 'sweets' table in our database.
export const sweets = sqliteTable("sweets", {
  id: integer("id").primaryKey(), // 'id' is an auto-incrementing primary key
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
});
