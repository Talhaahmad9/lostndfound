// app/api/lost/route.js
import { NextResponse } from "next/server";
import { validateLostItem } from "@/utils/validation";
import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { isValid, errors } = validateLostItem(body);

    if (!isValid) {
      return NextResponse.json(
        { error: "Validation Failed", details: errors },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("lostandfounddb");
    const collection = db.collection("lost_items");

    const newReport = {
      ...body,
      userId,
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
