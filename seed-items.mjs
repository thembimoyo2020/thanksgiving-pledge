import { drizzle } from "drizzle-orm/mysql2";
import { items } from "./drizzle/schema.ts";
import fs from "fs";

const db = drizzle(process.env.DATABASE_URL);

const itemsData = JSON.parse(fs.readFileSync("../items_data.json", "utf-8"));

async function seedItems() {
  console.log("Seeding items...");
  
  for (const item of itemsData) {
    await db.insert(items).values({
      name: item.name,
      description: item.description,
      price: item.price * 100, // Convert to cents
      quantity: item.quantity,
      shop: item.shop,
      totalPledged: 0,
      isLocked: 0,
    });
    console.log(`✓ Added: ${item.name}`);
  }
  
  console.log("✓ Seeding complete!");
  process.exit(0);
}

seedItems().catch((err) => {
  console.error("Error seeding items:", err);
  process.exit(1);
});
