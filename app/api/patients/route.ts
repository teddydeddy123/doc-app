import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET - Fetch all patients
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("doc-app");
    const patients = await db.collection("patients").find({}).toArray();

    // Convert ObjectId to string for JSON serialization
    const serializedPatients = patients.map((patient) => ({
      ...patient,
      _id: patient._id.toString(),
    }));

    return NextResponse.json(serializedPatients, { status: 200 });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 },
    );
  }
}

// POST - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("doc-app");

    const result = await db.collection("patients").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id: result.insertedId, ...body },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 },
    );
  }
}
