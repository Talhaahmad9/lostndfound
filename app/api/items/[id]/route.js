// app/api/items/[id]/route.js

import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("lostandfounddb");
}

export async function GET(request, { params }) {
  const { id } = await params;
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }
  try {
    const db = await connectToDatabase();
    const objectId = new ObjectId(id);
    let item = await db.collection("lost_items").findOne({ _id: objectId });
    if (!item) {
      item = await db.collection("found_items").findOne({ _id: objectId });
    }
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch item details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
