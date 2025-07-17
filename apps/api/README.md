# Sweet Shop Management API

Backend API service for the Sweet Shop Management## 🏗️ Project Structure

```
api/
├── src/                 # Source code
│   ├── db/              # Database related files
│   │   ├── migrations/  # Drizzle migrations
│   │   │   ├── migrate.ts       # Migration runner script
│   │   │   ├── 0000_*.sql      # Migration SQL files
│   │   │   └── meta/           # Migration metadata
│   │   ├── schema/      # Database schema
│   │   │   ├── index.ts        # Schema exports
│   │   │   └── sweets.ts       # Sweets table definition
│   │   └── seed.ts      # Seed data script
│   ├── services/        # Business logic services
│   │   └── sweetService.ts     # Sweet CRUD operations
│   ├── validation/      # Zod schemas for validation
│   │   └── schema.ts           # Input validation schemas
│   └── index.ts         # Main application entry
├── drizzle.config.ts    # Drizzle ORM configuration
└── sweet-shop.db        # SQLite database file (created on setup)
```

## 📊 Database Management

### Database Schema

The database consists of a main `sweets` table with the following structure:

```typescript
// From schema/sweets.ts
export const sweets = sqliteTable('sweets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

### Seed Data

The seed script adds the following sample sweets to your database:

- Chocolate Fudge (Chocolate category, $2.50)
- Vanilla Caramel (Caramel category, $2.25)
- Strawberry Delight (Fruit category, $1.95)
- Mint Chocolate (Chocolate category, $2.75)
- Honey Almond (Nuts category, $3.20)

You can run `pnpm seed` anytime to reset the database with these sample items.

### Database Operations

The application uses Drizzle ORM for database operations. If you need to modify the schema:

```bash
# After modifying the schema, generate a new migration
pnpm run generate

# Run the migration
pnpm run migrate
```

### Sample Data

The seed script (`src/db/seed.ts`) populates the database with initial sample data. You can modify this file to add your own sample sweets.with Hono, Drizzle ORM, and SQLite.

## 🛠️ Tech Stack

- **Framework**: [Hono](https://hono.dev/) - A small, simple, and ultrafast web framework
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/) for schema validation
- **Testing**: vitest for unit and integration tests

## 📋 API Features

- **CRUD Operations**: Create, read, update, and delete sweets
- **Search & Filtering**: Filter sweets by name, category, and price range
- **Sorting**: Sort results by name or price
- **Inventory Management**: Custom endpoints for purchase and restock operations
- **Validation**: Input validation for all endpoints
- **CORS Support**: Configured for frontend communication

## 🚀 Getting Started

### Local Development

```bash
# Navigate to the API directory
cd apps/api

# Install dependencies (if not already installed from root)
pnpm install

# Create and set up the database
pnpm setup

# Start the development server
pnpm dev
```

The API server will start at http://localhost:3000/api

### Database Setup

The application uses SQLite for data storage. To create and seed your database:

```bash
# One-command setup: generate migrations, migrate, and seed
pnpm setup

# Or run each step individually:
pnpm generate    # Generate migrations based on schema
pnpm migrate     # Apply migrations to database
pnpm seed        # Seed the database with initial data
```

This will:
1. Create a `sweet-shop.db` SQLite file in the root of the API directory
2. Run all database migrations to set up the schema
3. Populate the database with sample sweet shop items

## 📝 API Endpoints

### Sweets Management

| Method | Endpoint                | Description                           | Request Body                                        |
|--------|-------------------------|---------------------------------------|-----------------------------------------------------|
| GET    | /api/sweets             | List all sweets with optional filters | Query params: name, category, minPrice, maxPrice    |
| GET    | /api/sweets/:id         | Get a specific sweet by ID            | -                                                   |
| POST   | /api/sweets             | Create a new sweet                    | `{ name, category, price, stock }`                  |
| DELETE | /api/sweets/:id         | Delete a sweet                        | -                                                   |
| POST   | /api/sweets/:id/purchase| Purchase a sweet (reduce stock)       | `{ quantity: number }`                              |
| POST   | /api/sweets/:id/restock | Restock a sweet (increase stock)      | `{ quantity: number }`                              |

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

##  Project Structure

```
api/
├── src/                 # Source code
│   ├── db/              # Database related files
│   │   ├── migrations/  # Drizzle migrations
│   │   │   ├── 0000_*.sql      # Migration SQL files
│   │   │   └── meta/           # Migration metadata
│   │   ├── schema/      # Database schema
│   │   │   ├── index.ts        # Schema exports
│   │   │   └── sweets.ts       # Sweets table definition
│   │   ├── index.ts     # Database connection setup
│   │   └── seed.ts      # Seed data script
│   ├── services/        # Business logic services
│   │   └── sweetService.ts     # Sweet CRUD operations
│   ├── validation/      # Zod schemas for validation
│   │   └── schema.ts           # Input validation schemas
│   └── index.ts         # Main application entry
├── drizzle.config.ts    # Drizzle ORM configuration
└── sweet-shop.db        # SQLite database file (created on setup)
```

## 📊 Database Management

### Database Configuration

The database configuration is defined in `drizzle.config.ts`:

```typescript
export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:sweet-shop.db", // Path to your SQLite database file
  },
});
```

### Database Operations

The application uses Drizzle ORM for database operations. If you need to modify the schema:

```bash
# After modifying the schema files in src/db/schema/
pnpm generate   # Generate new migration files

# Apply the migrations to your database
pnpm migrate    # Run all pending migrations

# View your database with Drizzle Studio (web UI)
pnpm studio
```

### Seed Data

The seed script adds the following sample sweets to your database:

- Chocolate Fudge (Chocolate category, $2.50)
- Vanilla Caramel (Caramel category, $2.25)
- Strawberry Delight (Fruit category, $1.95)
- Mint Chocolate (Chocolate category, $2.75)
- Honey Almond (Nuts category, $3.20)

You can run `pnpm seed` anytime to reset the database with these sample items.