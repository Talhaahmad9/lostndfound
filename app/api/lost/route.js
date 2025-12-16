// app/api/lost/route.js

import { NextResponse } from "next/server";
import { validateLostItem } from "@/utils/validation";

async function connectToDatabase() {
  const { MongoClient } = require("mongodb");
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("lostandfounddb");
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { isValid, errors } = validateLostItem(body);

    if (!isValid) {
      return NextResponse.json(
        { error: "Validation Failed", details: errors },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection("lost_items");

    const newReport = {
      ...body,
      status: "Lost",
      date_submitted: new Date(),
    };

    const result = await collection.insertOne(newReport);

    if (result.acknowledged) {
      return NextResponse.json(
        {
          message: "Lost item reported successfully",
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
