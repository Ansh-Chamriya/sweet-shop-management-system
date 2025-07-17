import Database from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import { schema } from "../../db";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { SweetService } from "../../services/sweetService";

describe("getSweets: Data Retrieval Unit Tests", () => {
  let db: BetterSQLite3Database<typeof schema>;
  let service: SweetService;

  beforeEach(() => {
    const sqlite = new Database(":memory:");
    db = drizzle(sqlite, { schema });
    migrate(db, { migrationsFolder: "src/db/migrations" });
    service = new SweetService(db);
  });

  it("getAllSweets should return an empty array when no sweets exist", async () => {
    const sweets = await service.getAllSweets();

    expect(sweets).toBeInstanceOf(Array);
    expect(sweets.length).toBe(0);
  });

  it("getAllSweets should return all sweets when the database is populated", async () => {
    await db.insert(schema.sweets).values([
      { name: "Gummy Bears", category: "Candy", price: 2.99, quantity: 150 },
      { name: "Croissant", category: "Pastry", price: 35, quantity: 40 },
    ]);

    const sweets = await service.getAllSweets();

    expect(sweets.length).toBe(2);
    expect(sweets[0].name).toBe("Gummy Bears");
  });

  it("getSweetById should return the correct sweet for an existing ID", async () => {
    const [insertedSweet] = await db
      .insert(schema.sweets)
      .values({
        name: "Tart",
        category: "Pastry",
        price: 40,
        quantity: 10,
      })
      .returning();

    const sweet = await service.getSweetById(insertedSweet.id);

    expect(sweet).not.toBeNull();
    expect(sweet[0]?.id).toBe(insertedSweet.id);
    expect(sweet[0]?.name).toBe("Tart");
  });

  it("getSweetById should return null for a non-existent ID", async () => {
    const nonExistentId = 999;

    const sweet = await service.getSweetById(nonExistentId);

    expect(sweet).toEqual([]);
  });
});
