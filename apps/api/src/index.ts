import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { z } from "zod";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import * as schema from "./db/schema";
import { SweetService } from "./services/sweetService";
import { createSweetSchema, updateSweetSchema } from "./validation/schema";
import Database from "better-sqlite3";

// --- Factory Function for creating the App ---
// This function takes a database instance and returns a configured Hono app.
// It is exported as a named export and is safe to import in tests.
export const createApp = (db: BetterSQLite3Database<typeof schema>) => {
  const sweetService = new SweetService(db);
  const app = new Hono();

  // Add CORS middleware to allow requests from the frontend
  app.use(
    "/*",
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:3001",
        "http://localhost:8080",
      ],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      exposeHeaders: ["Content-Length", "X-Total-Count"],
      maxAge: 600,
      credentials: true,
    })
  );

  // --- API Routes ---
  const apiRoutes = app.basePath("/api");

  /*
   * 1. CREATE a new sweet
   */
  apiRoutes.post(
    "/sweets",
    zValidator("json", createSweetSchema),
    async (c) => {
      const newSweetData = c.req.valid("json");
      try {
        const createdSweet = await sweetService.createSweet(newSweetData);
        return c.json(createdSweet, 201);
      } catch (error) {
        return c.json({ error: "Failed to create sweet" }, 500);
      }
    }
  );

  /*
   * 2. VIEW all sweets (with search and sort)
   */
  apiRoutes.get(
    "/sweets",
    zValidator(
      "query",
      z.object({
        name: z.string().optional(),
        category: z.string().optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        sortBy: z.enum(["name", "price"]).optional(),
        order: z.enum(["asc", "desc"]).optional(),
      })
    ),
    async (c) => {
      const { name, category, minPrice, maxPrice, sortBy, order } =
        c.req.valid("query");
      const searchCriteria = {
        name,
        category,
        priceRange:
          minPrice && maxPrice
            ? ([parseFloat(minPrice), parseFloat(maxPrice)] as [number, number])
            : undefined,
      };
      const sortOptions = { sortBy, order };

      const sweets = await sweetService.searchSweets(
        searchCriteria,
        sortOptions
      );
      return c.json(sweets);
    }
  );

  // ... (All other routes: GET by ID, PUT, DELETE, POST purchase/restock) ...
  // ... This part of the code remains the same as your previous version ...
  /*
   * 3. VIEW a single sweet by ID
   */
  apiRoutes.get("/sweets/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    const sweet = await sweetService.getSweetById(id);
    if (!sweet[0]) {
      return c.json({ error: "Sweet not found" }, 404);
    }
    return c.json(sweet);
  });

  apiRoutes.delete("/sweets/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    try {
      const deletedSweet = await sweetService.deleteSweet(id);
      return c.json(deletedSweet);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: "Failed to delete sweet" }, 500);
    }
  });

  /*
   * 6. PURCHASE a sweet (custom action)
   */
  apiRoutes.post(
    "/sweets/:id/purchase",
    zValidator("json", z.object({ quantity: z.number().int().positive() })),
    async (c) => {
      const id = parseInt(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ error: "Invalid ID format" }, 400);
      }
      const { quantity } = c.req.valid("json");
      try {
        const updatedSweet = await sweetService.purchaseSweet(id, quantity);
        return c.json(updatedSweet);
      } catch (error: any) {
        if (error.message.includes("not found")) {
          return c.json({ error: error.message }, 404);
        }
        if (error.message.includes("Insufficient stock")) {
          return c.json({ error: error.message }, 400);
        }
        return c.json({ error: "Purchase failed" }, 500);
      }
    }
  );

  /*
   * 7. RESTOCK a sweet (custom action)
   */
  apiRoutes.post(
    "/sweets/:id/restock",
    zValidator("json", z.object({ quantity: z.number().int().positive() })),
    async (c) => {
      const id = parseInt(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ error: "Invalid ID format" }, 400);
      }
      const { quantity } = c.req.valid("json");
      try {
        const updatedSweet = await sweetService.restockSweet(id, quantity);
        return c.json(updatedSweet);
      } catch (error: any) {
        if (error.message.includes("not found")) {
          return c.json({ error: error.message }, 404);
        }
        return c.json({ error: "Restock failed" }, 500);
      }
    }
  );

  return app;
};
const sqlite = new Database("sweet-shop.db");
const db = drizzle(sqlite, { schema });
const app = createApp(db);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  console.log(`Server is running on http://localhost:${port}`);

  serve({
    fetch: app.fetch,
    port: Number(port),
  });
}

export default app;
