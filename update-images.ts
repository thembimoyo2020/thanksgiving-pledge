import { drizzle } from "drizzle-orm/mysql2";
import { items } from "./drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

const imageMapping: Record<number, string> = {
  1: "/items/aircon.png", // Air conditioning
  2: "/items/gate.webp", // Gate
  3: "/items/refrigerator.webp", // Refrigerators
  4: "/items/gasstove.png", // Gas stove
  5: "/items/plastic-table.webp", // Plastic tables
  6: "/items/steel-table.jpg", // Steel tables
  7: "/items/chafing-round.jpg", // Chafing dishes round
  8: "/items/chafing-rect.webp", // Chafing dishes rectangular
  9: "/items/plants.webp", // Outdoor plants
  10: "/items/microphone.jpg", // Microphone
  11: "/items/roofpaint.webp", // Roof paint
  12: "/items/tiles.png", // Tiles
  13: "/items/cushions.png", // Cushions
  14: "/items/rug.jpg", // Rug
};

async function updateImages() {
  console.log("Updating item images...");
  
  for (const [itemId, imageUrl] of Object.entries(imageMapping)) {
    await db
      .update(items)
      .set({ imageUrl })
      .where(eq(items.id, parseInt(itemId)));
    console.log(`✓ Updated item ${itemId} with image: ${imageUrl}`);
  }
  
  console.log("✓ All images updated!");
  process.exit(0);
}

updateImages().catch((err) => {
  console.error("Error updating images:", err);
  process.exit(1);
});
