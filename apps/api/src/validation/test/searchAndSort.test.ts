import Database from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import { schema } from "../../db";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { SweetService } from "../../services/sweetService";
import { sweet } from "../schema";

describe("SweetService: Search and Sort Unit Tests", () => {
  let db: BetterSQLite3Database<typeof schema>;
  let service: SweetService;

  // This beforeEach block seeds the database with a consistent dataset for each test.
  beforeEach(async () => {
    const sqlite = new Database(":memory:");
    db = drizzle(sqlite, { schema });
    migrate(db, { migrationsFolder: "src/db/migrations" });
    service = new SweetService(db);

    // Seed data for testing search and sort
    await db.insert(schema.sweets).values([
      { name: "Gummy Worms", category: "Candy", price: 2.5, quantity: 100 },
      {
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 15,
        quantity: 200,
      },
      { name: "Apple Tart", category: "Pastry", price: 40, quantity: 30 },
      { name: "Caramel Chew", category: "Candy", price: 30, quantity: 150 },
    ]);
  });

  /*
   * 1. Search Feature Tests
   */
  describe("Search Functionality", () => {
    it("should return sweets matching a specific category", async () => {
      const results = await service.searchSweets({ category: "Candy" });
      expect(results.length).toBe(2);
      expect(results.every((s: sweet) => s.category === "Candy")).toBe(true);
    });

    it("should return sweets matching a partial name search (case-insensitive)", async () => {
      const results = await service.searchSweets({ name: "bar" });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe("Chocolate Bar");
    });

    it("should return sweets within a specific price range", async () => {
      const results = await service.searchSweets({ priceRange: [2.0, 30] });
      expect(results.length).toBe(2); // Gummy Worms (2.50) and Caramel Chew (30.00)
      expect(results.map((s: sweet) => s.name).sort()).toEqual([
        "Caramel Chew",
        "Gummy Worms",
      ]);
    });

    it("should return sweets matching multiple criteria (category and price)", async () => {
      const results = await service.searchSweets({
        category: "Candy",
        priceRange: [10, 20],
      });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe("Chocolate Bar");
    });

    it("should return an empty array if no sweets match the criteria", async () => {
      const results = await service.searchSweets({ category: "Beverage" });
      expect(results.length).toBe(0);
    });
  });

  /*
   * 2. Sort Feature Tests
   */
  describe("Sort Functionality", () => {
    it("should return all sweets sorted by price in ascending order", async () => {
      const results = await service.searchSweets(
        {},
        { sortBy: "price", order: "asc" }
      );
      expect(results.length).toBe(4);
      expect(results.map((s: sweet) => s.price)).toEqual([2.5, 15, 30, 40]);
    });

    it("should return all sweets sorted by price in descending order", async () => {
      const results = await service.searchSweets(
        {},
        { sortBy: "price", order: "desc" }
      );
      expect(results.length).toBe(4);
      expect(results.map((s: sweet) => s.price)).toEqual([40, 30, 15, 2.5]);
    });

    it("should return all sweets sorted by name alphabetically", async () => {
      const results = await service.searchSweets(
        {},
        { sortBy: "name", order: "asc" }
      );
      expect(results.length).toBe(4);
      expect(results.map((s: sweet) => s.name)).toEqual([
        "Apple Tart",
        "Caramel Chew",
        "Chocolate Bar",
        "Gummy Worms",
      ]);
    });

    it("should return filtered results that are also sorted", async () => {
      // Search for 'Candy' and sort the results by name descending
      const results = await service.searchSweets(
        { category: "Candy" },
        { sortBy: "name", order: "desc" }
      );
      expect(results.length).toBe(2);
      expect(results.map((s: sweet) => s.name)).toEqual([
        "Gummy Worms",
        "Caramel Chew",
      ]);
    });
  });
});
