import { eq } from "drizzle-orm";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../db/schema";

export class SweetService {
  private db: BetterSQLite3Database<typeof schema>;

  constructor(db: BetterSQLite3Database<typeof schema>) {
    this.db = db;
  }

  async getAllSweets() {
    return this.db.select().from(schema.sweets);
  }
  async getSweetById(id: number) {
    // .get() is used for retrieving a single record
    const sweet = this.db
      .select()
      .from(schema.sweets)
      .where(eq(schema.sweets.id, id));
    return sweet || null;
  }
}
