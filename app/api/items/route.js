// app/api/items/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

const PAGE_LIMIT_DEFAULT = 9;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? PAGE_LIMIT_DEFAULT, 10);

  console.log("API /api/items called with:", { q, page, limit });

  try {
    const client = await clientPromise;
    const db = client.db("lostandfounddb");

    const skip = (page - 1) * limit;

    // Build filter for search
    const filter = q
      ? {
          $or: [
            { item_name: { $regex: `^${q}`, $options: "i" } },
            { category: { $regex: `^${q}`, $options: "i" } },
            { last_seen_location: { $regex: `^${q}`, $options: "i" } },
          ],
        }
      : {};

    const pipeline = [
      {
        $unionWith: {
          coll: "found_items",
        },
      },
      { $match: filter },
      { $sort: { date_submitted: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { contact_email: 0 } },
    ];

    console.log("Constructed aggregation pipeline:", JSON.stringify(pipeline, null, 2));

    const allItems = await db.collection("lost_items").aggregate(pipeline).toArray();

    console.log("Aggregation result count:", allItems.length);

    return NextResponse.json(allItems);
  } catch (error) {
    console.error(`Dashboard fetch error for query: { q: "${q}", page: ${page}, limit: ${limit} }`, error);
    return NextResponse.json(
      { error: "Database request failed" },
      { status: 500 }
    );
  }
}
