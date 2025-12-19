// lib/db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Add MONGODB_URI to .env.local");
}

let client;
let clientPromise;

// Function to create indexes
async function createIndexes(client) {
  try {
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
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the connection
  // isn't reset every time you save a file.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect().then(async (client) => {
      await createIndexes(client);
      return client;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, it's fine to just create a new client
  client = new MongoClient(uri);
  clientPromise = client.connect().then(async (client) => {
    await createIndexes(client);
    return client;
  });
}

export default clientPromise;
