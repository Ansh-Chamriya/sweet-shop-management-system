import { db, schema } from ".";

async function seed() {
  console.log("Seeding database...");

  try {
    // Clear existing data
    await db.delete(schema.sweets);

    // Insert sample sweet data
    const sampleSweets = [
      {
        name: "Chocolate Fudge",
        category: "Chocolate",
        price: 2.5,
        quantity: 50,
      },
      {
        name: "Vanilla Caramel",
        category: "Caramel",
        price: 2.25,
        quantity: 40,
      },
      {
        name: "Strawberry Delight",
        category: "Fruit",
        price: 1.95,
        quantity: 35,
      },
      {
        name: "Mint Chocolate",
        category: "Chocolate",
        price: 2.75,
        quantity: 30,
      },
      {
        name: "Honey Almond",
        category: "Nuts",
        price: 3.2,
        quantity: 25,
      },
    ];

    console.log("Inserting sample sweets:", sampleSweets);
    const result = await db.insert(schema.sweets).values(sampleSweets);
    console.log("Insert result:", result);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seed();
