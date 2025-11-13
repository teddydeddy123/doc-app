import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// GET - Fetch a single patient by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("doc-app");
    const patient = await db.collection("patients").findOne({
      _id: new ObjectId(id),
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Convert ObjectId to string for JSON serialization
    return NextResponse.json(
      {
        ...patient,
        _id: patient._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 },
    );
  }
}

// PUT - Update a patient
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("doc-app");

    const { name, age } = body;

    // Validate input
    if (!name || typeof age !== "number") {
      return NextResponse.json(
        { error: "Invalid input: name and age are required" },
        { status: 400 },
      );
    }

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          age,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const updatedPatient = await db.collection("patients").findOne({
      _id: new ObjectId(id),
    });

    if (!updatedPatient) {
      return NextResponse.json(
        { error: "Failed to retrieve updated patient" },
        { status: 500 },
      );
    }

    // Convert ObjectId to string for JSON serialization
    return NextResponse.json(
      {
        ...updatedPatient,
        _id: updatedPatient._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      {
        error: "Failed to update patient",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
