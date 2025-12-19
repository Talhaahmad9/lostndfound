import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("lostandfounddb");

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const skip = (page - 1) * limit;

    let filter = {};
    if (q) {
      // Using an anchored regex is more efficient as it can use an index
      const regex = new RegExp("^" + q, "i");
      filter = {
        $or: [
          { item_name: regex },
          { category: regex },
          { last_seen_location: regex },
        ],
      };
    }

    // This aggregation pipeline is much more efficient than fetching all items and sorting in memory
    const pipeline = [
      // Start with the lost_items collection
      { $match: filter },
      // Union with the found_items collection
      {
        $unionWith: {
          coll: "found_items",
          pipeline: [{ $match: filter }],
        },
      },
      // Sort the combined results
      { $sort: { date_submitted: -1 } },
      // Apply pagination
      { $skip: skip },
      { $limit: limit },
      // Exclude sensitive information
      { $project: { contact_email: 0 } },
    ];

    const allItems = await db
      .collection("lost_items")
      .aggregate(pipeline)
      .toArray();

    return NextResponse.json(allItems);
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json({ error: "Database timeout" }, { status: 500 });
  }
}
