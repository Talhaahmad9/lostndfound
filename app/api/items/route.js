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

    // --- FILTER ---
    // Regex search or use $text if indexes are created
    const filter = q
      ? {
          $or: [
            { item_name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
            { last_seen_location: { $regex: q, $options: "i" } },
            { date_found: { $regex: q, $options: "i" } }, // For found items
            { date_lost: { $regex: q, $options: "i" } }, // For lost items
          ],
        }
      : {};

    // --- AGGREGATION PIPELINE ---
    const pipeline = [
      { $match: filter },
      { $sort: { date_submitted: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { contact_email: 0 } },
      {
        $unionWith: {
          coll: "found_items",
          pipeline: [{ $match: filter }, { $project: { contact_email: 0 } }],
        },
      },
    ];

    const lostItems = await db
      .collection("lost_items")
      .aggregate(pipeline)
      .toArray();

    // --- TOTAL COUNT FOR PAGINATION ---
    const countPipeline = [
      { $match: filter },
      { $count: "totalItems" },
      {
        $unionWith: {
          coll: "found_items",
          pipeline: [{ $match: filter }, { $count: "totalItems" }],
        },
      },
    ];

    const countResult = await db
      .collection("lost_items")
      .aggregate(countPipeline)
      .toArray();

    let totalItems = 0;
    countResult.forEach((c) => {
      if (c.totalItems) totalItems += c.totalItems;
    });

    return NextResponse.json({ allItems: lostItems, totalItems });
  } catch (error) {
    console.error(
      `Dashboard fetch error for query: { q: "${q}", page: ${page}, limit: ${limit} }`,
      error
    );
    return NextResponse.json(
      { error: "Database request failed" },
      { status: 500 }
    );
  }
}
