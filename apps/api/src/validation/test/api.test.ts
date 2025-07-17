import { eq } from "drizzle-orm";
import { describe, it, expect, beforeEach } from "vitest";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
// import app from "../../index";
import { schema } from "../../db";
import { createApp } from "../../index";

describe("Sweet Shop API Integration Tests", () => {
  let db: BetterSQLite3Database<typeof schema>;
  let testApp: Awaited<ReturnType<typeof createApp>>; // The type is a Hono instance

  beforeEach(async () => {
    // 1. Create a fresh in-memory database for each test
    const sqlite = new Database(":memory:");
    db = drizzle(sqlite, { schema });
    migrate(db, { migrationsFolder: "./src/db/migrations" });

    // 2. Create a new app instance connected to the in-memory database
    testApp = createApp(db);

    // 3. Seed the in-memory database with test data
    await db.insert(schema.sweets).values([
      { name: "Gummy Worms", category: "Candy", price: 2.5, quantity: 100 },
      {
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 1.75,
        quantity: 20,
      },
    ]);
  });

  // Test for VIEW (All)
  it("GET /api/sweets - should return all sweets", async () => {
    const res = await testApp.request("/api/sweets");
    expect(res.status).toBe(200);
    const body = await res.json();
    // This will now correctly find the 2 sweets seeded in the in-memory DB
    expect(body.length).toBe(2);
  });

  // Test for CREATE
  it("POST /api/sweets - should create a new sweet", async () => {
    const newSweet = {
      name: "Apple Tart",
      category: "Pastry",
      price: 4.0,
      quantity: 30,
    };
    const res = await testApp.request("/api/sweets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSweet),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe("Apple Tart");

    // Verify it was added to the same DB instance
    const allSweets = await db.select().from(schema.sweets);
    expect(allSweets.length).toBe(3); // 2 from seed + 1 new
  });

  // Test for VIEW (Search)
  it("GET /api/sweets?category=Candy - should return filtered sweets", async () => {
    const res = await testApp.request("/api/sweets?category=Candy");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.length).toBe(1);
    expect(body[0].name).toBe("Gummy Worms");
  });

  // Test for VIEW (Single)
  it("GET /api/sweets/:id - should return a single sweet", async () => {
    const [sweet] = await db
      .select()
      .from(schema.sweets)
      .where(eq(schema.sweets.name, "Gummy Worms"));
    const res = await testApp.request(`/api/sweets/${sweet.id}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].name).toBe("Gummy Worms");
  });

  it("GET /api/sweets/:id - should return 404 for non-existent sweet", async () => {
    const res = await testApp.request("/api/sweets/9995");
    expect(res.status).toBe(404);
  });

  // Test for DELETE
  it("DELETE /api/sweets/:id - should delete a sweet", async () => {
    const [sweet] = await db
      .select()
      .from(schema.sweets)
      .where(eq(schema.sweets.name, "Gummy Worms"));
    const res = await testApp.request(`/api/sweets/${sweet.id}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    const verifyRes = await testApp.request(`/api/sweets/${sweet.id}`);
    expect(verifyRes.status).toBe(404);
  });

  // Test for PURCHASE
  it("POST /api/sweets/:id/purchase - should decrease stock", async () => {
    const [sweet] = await db
      .select()
      .from(schema.sweets)
      .where(eq(schema.sweets.name, "Chocolate Bar"));
    const purchase = { quantity: 10 };
    const res = await testApp.request(`/api/sweets/${sweet.id}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(purchase),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.quantity).toBe(10); // 20 - 10 = 10
  });

  it("POST /api/sweets/:id/purchase - should return 400 for insufficient stock", async () => {
    const [sweet] = await db
      .select()
      .from(schema.sweets)
      .where(eq(schema.sweets.name, "Chocolate Bar"));
    const purchase = { quantity: 100 };
    const res = await testApp.request(`/api/sweets/${sweet.id}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(purchase),
    });
    expect(res.status).toBe(400);
  });

  // Test for RESTOCK
  it("POST /api/sweets/:id/restock - should increase stock", async () => {
    const [sweet] = await db
      .select()
      .from(schema.sweets)
      .where(eq(schema.sweets.name, "Gummy Worms"));
    const restock = { quantity: 50 };
    const res = await testApp.request(`/api/sweets/${sweet.id}/restock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restock),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.quantity).toBe(150); // 100 + 50 = 150
  });
});
