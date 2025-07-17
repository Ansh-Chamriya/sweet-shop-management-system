import { eq, and, like, gte, lte, asc, desc } from "drizzle-orm";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../db/schema";
export interface SearchCriteria {
  name?: string;
  category?: string;
  priceRange?: [number, number];
}

export interface SortOptions {
  sortBy?: "name" | "price";
  order?: "asc" | "desc";
}

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

  async searchSweets(criteria: SearchCriteria, sortOptions: SortOptions = {}) {
    const conditions = [];

    if (criteria.name) {
      conditions.push(like(schema.sweets.name, `%${criteria.name}%`));
    }
    if (criteria.category) {
      conditions.push(eq(schema.sweets.category, criteria.category));
    }
    if (criteria.priceRange) {
      const [minPrice, maxPrice] = criteria.priceRange;
      conditions.push(gte(schema.sweets.price, minPrice));
      conditions.push(lte(schema.sweets.price, maxPrice));
    }

    // Determine sorting order
    let orderByClause;
    if (sortOptions.sortBy === "price") {
      orderByClause =
        sortOptions.order === "desc"
          ? desc(schema.sweets.price)
          : asc(schema.sweets.price);
    } else if (sortOptions.sortBy === "name") {
      orderByClause =
        sortOptions.order === "desc"
          ? desc(schema.sweets.name)
          : asc(schema.sweets.name);
    }

    return this.db.query.sweets.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: orderByClause,
    });
  }

  async purchaseSweet(sweetId: number, quantityToPurchase: number) {
    const [sweet] = await this.getSweetById(sweetId);

    if (!sweet) {
      throw new Error("Sweet not found.");
    }

    if (sweet?.quantity < quantityToPurchase) {
      throw new Error("Insufficient stock available.");
    }

    const newQuantity = sweet?.quantity - quantityToPurchase;

    const [updatedSweet] = await this.db
      .update(schema.sweets)
      .set({ quantity: newQuantity })
      .where(eq(schema.sweets.id, sweetId))
      .returning();

    return updatedSweet;
  }

  async restockSweet(sweetId: number, quantityToAdd: number) {
    const [sweet] = await this.getSweetById(sweetId);

    if (!sweet) {
      throw new Error("Sweet not found.");
    }

    const newQuantity = sweet?.quantity + quantityToAdd;

    const [updatedSweet] = await this.db
      .update(schema.sweets)
      .set({ quantity: newQuantity })
      .where(eq(schema.sweets.id, sweetId))
      .returning();

    return updatedSweet;
  }
}
