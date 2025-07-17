import Database from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { beforeEach, describe, expect, it } from "vitest";
import { schema } from "../../db";
import { SweetService } from "../../services/sweetService";

describe("SweetService: Inventory Management Unit Tests", () => {
  let db: BetterSQLite3Database<typeof schema>;
  let service: SweetService;
  let testSweetId: number;

  beforeEach(async () => {
    const sqlite = new Database(":memory:");
    db = drizzle(sqlite, { schema });
    migrate(db, { migrationsFolder: "src/db/migrations" });
    service = new SweetService(db);

    const [insertedSweet] = await db
      .insert(schema.sweets)
      .values({
        name: "Chocolate Fudge",
        category: "Special",
        price: 5.0,
        quantity: 20,
      })
      .returning();
    testSweetId = insertedSweet.id;
  });

  describe("purchaseSweet", () => {
    it("should decrease the quantity of a sweet after a successful purchase", async () => {
      const updatedSweet = await service.purchaseSweet(testSweetId, 5);

      expect(updatedSweet.quantity).toBe(15);

      // Verify the change in the database directly
      const dbSweet = await service.getSweetById(testSweetId);
      expect(dbSweet?.quantity).toBe(15);
    });

    it("should throw an error if purchase quantity exceeds available stock", async () => {
      await expect(service.purchaseSweet(testSweetId, 25)).rejects.toThrow(
        "Insufficient stock available."
      );
    });

    it("should allow a purchase of the exact available stock, resulting in zero quantity", async () => {
      const updatedSweet = await service.purchaseSweet(testSweetId, 20);

      expect(updatedSweet.quantity).toBe(0);
    });

    it("should throw an error when trying to purchase a sweet that does not exist", async () => {
      await expect(service.purchaseSweet(999, 1)).rejects.toThrow(
        "Sweet not found."
      );
    });
  });

  describe("restockSweet", () => {
    it("should increase the quantity of a sweet after a successful restock", async () => {
      const updatedSweet = await service.restockSweet(testSweetId, 30);

      expect(updatedSweet.quantity).toBe(50);

      const dbSweet = await service.getSweetById(testSweetId);
      expect(dbSweet?.quantity).toBe(50);
    });

    it("should correctly restock a sweet that has zero quantity", async () => {
      await service.purchaseSweet(testSweetId, 20);

      const updatedSweet = await service.restockSweet(testSweetId, 25);

      expect(updatedSweet.quantity).toBe(25);
    });

    it("should throw an error when trying to restock a sweet that does not exist", async () => {
      await expect(service.restockSweet(999, 10)).rejects.toThrow(
        "Sweet not found."
      );
    });
  });
});
