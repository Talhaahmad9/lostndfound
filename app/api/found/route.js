// app/api/found/route.js

import { NextResponse } from "next/server";
import { validateFoundItem } from "@/utils/validation";
import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/db";

export async function POST(request) {
  try {
    // ✅ Clerk auth
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // ✅ Validate input
    const { isValid, errors } = validateFoundItem(body);
    if (!isValid) {
      return NextResponse.json(
        { error: "Validation Failed", details: errors },
        { status: 400 }
      );
    }

    // ✅ Connect to DB via clientPromise
    const client = await clientPromise;
    const db = client.db("lostandfounddb");
    const collection = db.collection("found_items");

    // ✅ Create new report
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
