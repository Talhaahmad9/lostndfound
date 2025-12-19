
import clientPromise from "@/lib/db";

async function createIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db("lostandfounddb");

    // Indexes for lost_items collection
    await db.collection("lost_items").createIndex({ item_name: 1 });
    await db.collection("lost_items").createIndex({ category: 1 });
    await db.collection("lost_items").createIndex({ last_seen_location: 1 });

    // Indexes for found_items collection
    await db.collection("found_items").createIndex({ item_name: 1 });
    await db.collection("found_items").createIndex({ category: 1 });
    await db.collection("found_items").createIndex({ last_seen_location: 1 });

    console.log("Indexes created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating indexes:", error);
    process.exit(1);
  }
}

createIndexes();
