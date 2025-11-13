import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET - Fetch consultations for a patient
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("doc-app");
    const consultations = await db
      .collection("consultations")
      .find({ patientId: id })
      .sort({ date: -1 })
      .toArray();

    // Convert ObjectId to string for JSON serialization
    const serializedConsultations = consultations.map((consultation) => ({
      ...consultation,
      _id: consultation._id.toString(),
    }));

    return NextResponse.json(serializedConsultations, { status: 200 });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 },
    );
  }
}

// POST - Create a new consultation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("doc-app");

    const result = await db.collection("consultations").insertOne({
      patientId: id,
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { _id: result.insertedId.toString(), patientId: id, ...body },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      { error: "Failed to create consultation" },
      { status: 500 },
    );
  }
}
