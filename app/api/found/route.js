import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("lostandfounddb");
}

const validateFoundItem = (body) => {
  const {
    item_name,
    category,
    last_seen_location,
    date_found,
    description,
    contact_email,
  } = body;
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!item_name || item_name.length < 3 || item_name.length > 100) {
    errors.item_name = "Item name must be between 3 and 100 characters.";
  }
  if (!category || typeof category !== "string") {
    errors.category = "Invalid category.";
  }
  if (!last_seen_location || last_seen_location.length < 5) {
    errors.last_seen_location = "Location is required and must be descriptive.";
  }
  if (!description || description.length < 10 || description.length > 500) {
    errors.description = "Description must be between 10 and 500 characters.";
  }
  if (!contact_email || !emailRegex.test(contact_email)) {
    errors.contact_email = "Invalid contact email format.";
  }
  if (date_found) {
    const foundDate = new Date(date_found);
    const today = new Date();
    if (isNaN(foundDate) || foundDate > today) {
      errors.date_found = "Invalid or future date provided.";
    }
  } else {
    errors.date_found = "Date found is required.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export async function POST(request) {
  try {
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
