import { NextResponse } from "next/server";
import { validateLostItem } from "@/utils/validation";
import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/db";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

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

    const newReport = {
      ...body,
      userId,
      status: "Lost",
      date_submitted: new Date(),
    };

    const result = await db.collection("lost_items").insertOne(newReport);

    return NextResponse.json(
      {
        message: "Lost item reported successfully",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
