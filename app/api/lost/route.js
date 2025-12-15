// app/api/lost/route.js

import { NextResponse } from "next/server";

// Placeholder for your actual database connection utility
// Replace this function with your actual database connection logic
async function connectToDatabase() {
  const { MongoClient } = require("mongodb");
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("lostandfounddb");
}

// --- NEW BACKEND VALIDATION UTILITY ---
const validateLostItem = (body) => {
  const {
    item_name,
    category,
    last_seen_location,
    date_lost,
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
    errors.last_seen_location =
      "Last seen location is required and must be descriptive.";
  }
  if (!description || description.length < 10 || description.length > 500) {
    errors.description = "Description must be between 10 and 500 characters.";
  }
  if (!contact_email || !emailRegex.test(contact_email)) {
    errors.contact_email = "Invalid contact email format.";
  }
  if (date_lost) {
    const lostDate = new Date(date_lost);
    const today = new Date();
    // Check if date is valid and not in the future
    if (isNaN(lostDate) || lostDate > today) {
      errors.date_lost = "Invalid or future date provided.";
    }
  } else {
    errors.date_lost = "Date lost is required.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export async function POST(request) {
  try {
    const body = await request.json();

    // Run backend validation
    const { isValid, errors } = validateLostItem(body);

    if (!isValid) {
      // Return specific validation errors to the client
      return NextResponse.json(
        { error: "Validation Failed", details: errors },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection("lost_items");

    // Prepare document for insertion
    const newReport = {
      ...body,
      status: "Lost", // Default status
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
