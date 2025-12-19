// app/api/items/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

const PAGE_LIMIT_DEFAULT = 9;

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("lostandfounddb");

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? PAGE_LIMIT_DEFAULT, 10);
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

    // Fetch lost and found items separately
    const [lostItems, foundItems] = await Promise.all([
      db
        .collection("lost_items")
        .find(filter)
        .sort({ date_submitted: -1 })
        .skip(skip)
        .limit(limit)
        .project({ contact_email: 0 })
        .toArray(),
      db
        .collection("found_items")
        .find(filter)
        .sort({ date_submitted: -1 })
        .skip(skip)
        .limit(limit)
        .project({ contact_email: 0 })
        .toArray(),
    ]);

    // Merge and sort in JS
    const allItems = [...lostItems, ...foundItems].sort(
      (a, b) => b.date_submitted - a.date_submitted
    );

    // Return paginated slice
    const paginatedItems = allItems.slice(0, limit);

    return NextResponse.json(paginatedItems);
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { error: "Database request failed" },
      { status: 500 }
    );
  }
}
