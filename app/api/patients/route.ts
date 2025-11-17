import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET - Fetch all patients
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("doc-app");

    // Aggregate patients with their latest consultation date as lastVisit
    const patients = await db
      .collection("patients")
      .aggregate([
        { $addFields: { _idStr: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "consultations",
            let: { pid: "$_idStr" },
            pipeline: [
              { $match: { $expr: { $eq: ["$patientId", "$$pid"] } } },
              { $sort: { date: -1 } }, // latest first
              { $limit: 1 }, // only latest
              { $project: { _id: 0, date: 1 } },
            ],
            as: "latestConsultation",
          },
        },
        {
          $addFields: {
            lastVisit: {
              $ifNull: [
                { $arrayElemAt: ["$latestConsultation.date", 0] },
                null,
              ],
            },
          },
        },
        { $project: { _idStr: 0, latestConsultation: 0 } },
      ])
      .toArray();

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
