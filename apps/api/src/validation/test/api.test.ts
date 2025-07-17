import { describe, it, expect, beforeEach } from "vitest";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import app from "../../index";
import { schema } from "../../db";

// This setup uses an in-memory SQLite database for testing
// to ensure tests are fast and isolated.
let db: BetterSQLite3Database<typeof schema>;

// A helper function to create a test instance of the app
const createTestApp = () => {
  const sqlite = new Database(":memory:");
  db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: "src/db/migrations" });

  return app;
};

describe("Sweet Shop API Integration Tests", () => {
  let testApp: typeof app;

  beforeEach(async () => {
    testApp = createTestApp();
    // Clear and seed the database before each test
    await db.delete(schema.sweets);
    await db.insert(schema.sweets).values([
      {
        id: 1,
        name: "Gummy Worms",
        category: "Candy",
        price: 2.5,
        quantity: 100,
      },
      {
        id: 2,
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 1.75,
        quantity: 20,
      },
    ]);
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
  });

  // Test for VIEW (All)
  it("GET /api/sweets - should return all sweets", async () => {
    const res = await testApp.request("/api/sweets");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.length).toBe(2);
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
    const res = await testApp.request("/api/sweets/1");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Gummy Worms");
  });

  it("GET /api/sweets/:id - should return 404 for non-existent sweet", async () => {
    const res = await testApp.request("/api/sweets/999");
    expect(res.status).toBe(404);
  });

  // Test for DELETE
  it("DELETE /api/sweets/:id - should delete a sweet", async () => {
    const res = await testApp.request("/api/sweets/1", { method: "DELETE" });
    expect(res.status).toBe(200);
    const verifyRes = await testApp.request("/api/sweets/1");
    expect(verifyRes.status).toBe(404);
  });

  // Test for PURCHASE
  it("POST /api/sweets/:id/purchase - should decrease stock", async () => {
    const purchase = { quantity: 10 };
    const res = await testApp.request("/api/sweets/2/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(purchase),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.quantity).toBe(10); // 20 - 10 = 10
  });

  it("POST /api/sweets/:id/purchase - should return 400 for insufficient stock", async () => {
    const purchase = { quantity: 100 };
    const res = await testApp.request("/api/sweets/2/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(purchase),
    });
    expect(res.status).toBe(400);
  });

  // Test for RESTOCK
  it("POST /api/sweets/:id/restock - should increase stock", async () => {
    const restock = { quantity: 50 };
    const res = await testApp.request("/api/sweets/1/restock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restock),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.quantity).toBe(150); // 100 + 50 = 150
  });
});
