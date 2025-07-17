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

    // Execute the query using Drizzle's findMany
    return this.db.query.sweets.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: orderByClause,
    });
  }
}
