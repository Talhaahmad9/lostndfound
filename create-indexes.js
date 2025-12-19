// create-indexes.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // explicitly load .env.local

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

async function createIndexes() {
  const client = new MongoClient(uri, { maxPoolSize: 10 });

  try {
    await client.connect();
    const db = client.db("lostandfounddb");

    // Lost items indexes
    await db
      .collection("lost_items")
      .createIndexes([
        { key: { item_name: 1 } },
        { key: { category: 1 } },
        { key: { last_seen_location: 1 } },
      ]);

    // Found items indexes
    await db
      .collection("found_items")
      .createIndexes([
        { key: { item_name: 1 } },
        { key: { category: 1 } },
        { key: { last_seen_location: 1 } },
      ]);

    console.log("Indexes created successfully!");
  } catch (err) {
    console.error("Failed to create indexes:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

createIndexes();
