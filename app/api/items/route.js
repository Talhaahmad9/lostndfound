// app/api/items/route.js

import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("lostandfounddb");
}

export async function GET(request) {
  try {
    const db = await connectToDatabase();
    const lostCollection = db.collection("lost_items");
    const foundCollection = db.collection("found_items");

    // Get search query from URL
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    // Build MongoDB filter for search
    let filter = {};
    if (q) {
      const regex = new RegExp(q, "i"); // case-insensitive
      filter = {
        $or: [
          { item_name: regex },
          { category: regex },
          { last_seen_location: regex },
        ],
      };
    }

    // Fetch filtered items, excluding sensitive contact info
    const lostItems = await lostCollection
      .find(filter)
      .project({ contact_email: 0 })
      .toArray();

    const foundItems = await foundCollection
      .find(filter)
      .project({ contact_email: 0 })
      .toArray();

    // Merge and prepare items for the frontend
    const allItems = [...lostItems, ...foundItems];

    // Sort by the most recently submitted item (descending date_submitted)
    allItems.sort(
      (a, b) => new Date(b.date_submitted) - new Date(a.date_submitted)
    );

    return NextResponse.json(allItems, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch items for dashboard:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
