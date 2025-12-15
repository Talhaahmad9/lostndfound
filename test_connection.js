// test_connection.js

// Load environment variables from .env.local
require("dotenv").config({ path: "./.env.local" });

const { MongoClient } = require("mongodb");

// Access the URI from the environment variable MONGODB_URI
const uri = process.env.MONGODB_URI;

// Check if the URI was loaded
if (!uri) {
  console.error(
    "❌ Error: MONGODB_URI not found in .env.local file. Please check the file and variable name."
  );
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Success! You successfully connected to MongoDB Atlas.");

    // Optional: Insert a test document
    const testDatabase = client.db("lost_and_found_db");
    const itemsCollection = testDatabase.collection("test_items");

    const testDoc = {
      title: "Test Connection Item",
      status: "Verified (via .env.local)",
      timestamp: new Date(),
    };

    await itemsCollection.insertOne(testDoc);
    console.log(
      "🎉 Test document inserted successfully into 'lost_and_found_db.test_items'."
    );
  } catch (error) {
    console.error(
      "❌ Connection Failed. Check your URI, credentials, and IP address list."
    );
    console.error("Error details:", error.message);
  } finally {
    await client.close();
  }
}

run();
