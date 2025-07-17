import Database from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import { schema } from "../../db";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { SweetService } from "../../services/sweetService";

describe("SweetService: Delete Sweets Unit Tests", () => {
  let db: BetterSQLite3Database<typeof schema>;
  let service: SweetService;
  let sweetId: number;

  beforeEach(async () => {
    const sqlite = new Database(":memory:");
    db = drizzle(sqlite, { schema });
    migrate(db, { migrationsFolder: "src/db/migrations" });
    service = new SweetService(db);

    // Seed a sweet to be deleted in the tests
    const [insertedSweet] = await db
      .insert(schema.sweets)
      .values({
        name: "Temporary Treat",
        category: "Limited Edition",
        price: 75,
        quantity: 10,
      })
      .returning();
    sweetId = insertedSweet.id;
  });

  it("should successfully delete an existing sweet", async () => {
    const deletedSweet = await service.deleteSweet(sweetId);

    expect(deletedSweet).not.toBeNull();
    expect(deletedSweet.id).toBe(sweetId);
    expect(deletedSweet.name).toBe("Temporary Treat");

    // Verify: Attempt to fetch the sweet again and expect it to be gone
    const result = await service.getSweetById(sweetId);
    expect(result.length).toBe(0);
  });

  it("should throw an error when trying to delete a sweet that does not exist", async () => {
    const nonExistentId = 999;

    await expect(service.deleteSweet(nonExistentId)).rejects.toThrow(
      "Sweet not found."
    );
  });
});
