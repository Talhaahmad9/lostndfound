// test_connection.js
require("dotenv").config({ path: "./.env.local" });
const { MongoClient } = require("mongodb");
const dns = require("dns").promises;

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Error: MONGODB_URI not found.");
  process.exit(1);
}

async function run() {
  console.log("--- 🕵️ Diagnostic Report ---");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(
    `Attempting to connect with URI: ${
      uri.split("@")[1] ? "***@" + uri.split("@")[1] : uri
    }`
  ); // Hide password

  // 1. DNS Check: Can we even find the cluster?
  try {
    const hostname = uri.split("@")[1].split("/")[0].split("?")[0];
    console.log(`🔍 Checking DNS for: ${hostname}...`);

    // Check for SRV records specifically (this is what ETIMEOUT usually hits)
    if (uri.startsWith("mongodb+srv")) {
      const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${hostname}`);
      console.log(
        "✅ DNS SRV Records found:",
        JSON.stringify(srvRecords, null, 2)
      );
    }

    const addresses = await dns.lookup(hostname);
    console.log("✅ DNS IP Resolution:", addresses.address);
  } catch (dnsError) {
    console.error(
      "❌ DNS/Network Error: Your computer cannot find the MongoDB servers."
    );
    console.error("Specific DNS Error Code:", dnsError.code);
    console.error("Full DNS Error:", dnsError.message);
  }

  // 2. MongoDB Connection Attempt
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  try {
    console.log("⏳ Connecting to MongoDB Atlas (5s timeout)...");
    await client.connect();

    console.log("✅ TCP Connection established.");

    // 3. Command Ping
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping Success: MongoDB is responding.");

    // 4. Permission Check
    const db = client.db("lostandfounddb");
    const collections = await db.listCollections().toArray();
    console.log(
      "✅ Permissions: Found collections:",
      collections.map((c) => c.name).join(", ")
    );
  } catch (error) {
    console.error("--- ❌ CRITICAL CONNECTION FAILURE ---");
    console.error("Error Code:", error.code || "No Code");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);

    if (error.message.includes("queryTxt ETIMEOUT")) {
      console.error(
        "\n💡 ANALYSIS: Your ISP or Router is blocking the 'SRV' DNS lookup."
      );
      console.error(
        "FIX: Change your MONGODB_URI to the 'Legacy' (mongodb://) format."
      );
    }
  } finally {
    await client.close();
    console.log("--- 🏁 Diagnostics Complete ---");
  }
}

run();
