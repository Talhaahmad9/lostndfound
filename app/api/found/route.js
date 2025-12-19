import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { validateFoundItem } from "@/utils/validation";
import { auth } from "@clerk/nextjs/server";

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("lostandfounddb");
}

export async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { isValid, errors } = validateFoundItem(body);

    if (!isValid) {
      return NextResponse.json(
        { error: "Validation Failed", details: errors },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection("found_items");

    const newReport = {
      ...body,
      userId,
      status: "Found",
      date_submitted: new Date(),
    };

    const result = await collection.insertOne(newReport);

    if (result.acknowledged) {
      return NextResponse.json(
        {
          message: "Found item reported successfully",
          id: result.insertedId,
        },
        { status: 201 }
      );
    } else {
      throw new Error("MongoDB insertion failed.");
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
