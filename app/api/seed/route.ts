import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// This route seeds the database with initial dummy data
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("doc-app");

    const existingPatients = await db.collection("patients").countDocuments();
    if (existingPatients > 0) {
      return NextResponse.json(
        { message: "Database already seeded" },
        { status: 200 },
      );
    }

    // Seed patients
    const patients = [
      {
        id: 1,
        name: "João Silva",
        age: 45,
        email: "joao.silva@email.com",
        phone: "(11) 98765-4321",
      },
      {
        id: 2,
        name: "Maria Santos",
        age: 32,
        email: "maria.santos@email.com",
        phone: "(11) 98765-4322",
      },
      {
        id: 3,
        name: "Pedro Oliveira33",
        age: 28,
        email: "pedro.oliveira@email.com",
        phone: "(11) 98765-4323",
      },
      {
        id: 4,
        name: "Ana Costa",
        age: 55,
        email: "ana.costa@email.com",
        phone: "(11) 98765-4324",
      },
      {
        id: 5,
        name: "Carlos Ferreira",
        age: 38,
        email: "carlos.ferreira@email.com",
        phone: "(11) 98765-4325",
      },
      {
        id: 6,
        name: "Juliana Alves",
        age: 29,
        email: "juliana.alves@email.com",
        phone: "(11) 98765-4326",
      },
      {
        id: 7,
        name: "Roberto Lima",
        age: 62,
        email: "roberto.lima@email.com",
        phone: "(11) 98765-4327",
      },
      {
        id: 8,
        name: "Fernanda Rocha",
        age: 41,
        email: "fernanda.rocha@email.com",
        phone: "(11) 98765-4328",
      },
      {
        id: 9,
        name: "Lucas Martins",
        age: 35,
        email: "lucas.martins@email.com",
        phone: "(11) 98765-4329",
      },
      {
        id: 10,
        name: "Patricia Souza",
        age: 48,
        email: "patricia.souza@email.com",
        phone: "(11) 98765-4330",
      },
    ];

    const patientResult = await db.collection("patients").insertMany(
      patients.map((p) => ({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    );

    // Get the inserted patient IDs to link consultations
    const insertedPatients = await db.collection("patients").find({}).toArray();
    const patientIdMap: Record<number, string> = {};
    insertedPatients.forEach((p) => {
      if (p.id) {
        patientIdMap[p.id] = p._id.toString();
      }
    });

    // Seed consultations - map numeric IDs to MongoDB _id strings
    const consultations = [
      {
        patientIdNum: 1,
        date: "2024-01-15",
        doctor: "Dr. Ana Silva",
        diagnosis: "Hypertension",
        notes: "Blood pressure controlled. Continue medication.",
      },
      {
        patientIdNum: 1,
        date: "2024-02-20",
        doctor: "Dr. Ana Silva",
        diagnosis: "General check-up",
        notes: "Routine tests performed. Everything normal.",
      },
      {
        patientIdNum: 1,
        date: "2024-03-10",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Back pain",
        notes: "Physical therapy prescribed.",
      },
      {
        patientIdNum: 2,
        date: "2024-01-10",
        doctor: "Dr. Ana Silva",
        diagnosis: "Flu",
        notes: "Mild symptoms. Rest recommended.",
      },
      {
        patientIdNum: 2,
        date: "2024-02-05",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Check-up",
        notes: "Blood tests normal.",
      },
      {
        patientIdNum: 3,
        date: "2024-01-20",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Sports injury",
        notes: "Ankle sprain. Rest and ice.",
      },
      {
        patientIdNum: 3,
        date: "2024-02-15",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Follow-up",
        notes: "Significant improvement. Continue physical therapy.",
      },
      {
        patientIdNum: 4,
        date: "2024-01-05",
        doctor: "Dr. Ana Silva",
        diagnosis: "Type 2 diabetes",
        notes: "Blood sugar controlled. Maintain diet.",
      },
      {
        patientIdNum: 4,
        date: "2024-02-12",
        doctor: "Dr. Ana Silva",
        diagnosis: "Follow-up",
        notes: "Glucose tests within normal range.",
      },
      {
        patientIdNum: 4,
        date: "2024-03-18",
        doctor: "Dr. Ana Silva",
        diagnosis: "Check-up",
        notes: "Everything stable.",
      },
      {
        patientIdNum: 5,
        date: "2024-01-25",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Headache",
        notes: "Migraine. Medication prescribed.",
      },
      {
        patientIdNum: 5,
        date: "2024-02-28",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Follow-up",
        notes: "Symptoms improved.",
      },
      {
        patientIdNum: 6,
        date: "2024-01-12",
        doctor: "Dr. Ana Silva",
        diagnosis: "Annual check-up",
        notes: "Complete tests. Everything normal.",
      },
      {
        patientIdNum: 7,
        date: "2024-01-08",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Arthritis",
        notes: "Anti-inflammatory medication prescribed.",
      },
      {
        patientIdNum: 7,
        date: "2024-02-10",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Follow-up",
        notes: "Pain reduced. Continue treatment.",
      },
      {
        patientIdNum: 7,
        date: "2024-03-20",
        doctor: "Dr. Ana Silva",
        diagnosis: "Check-up",
        notes: "Condition stable.",
      },
      {
        patientIdNum: 8,
        date: "2024-01-18",
        doctor: "Dr. Ana Silva",
        diagnosis: "Anxiety",
        notes: "Referred to psychologist.",
      },
      {
        patientIdNum: 8,
        date: "2024-02-22",
        doctor: "Dr. Ana Silva",
        diagnosis: "Follow-up",
        notes: "Overall condition improved.",
      },
      {
        patientIdNum: 9,
        date: "2024-01-30",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Knee injury",
        notes: "Imaging exam requested.",
      },
      {
        patientIdNum: 9,
        date: "2024-02-25",
        doctor: "Dr. Carlos Mendes",
        diagnosis: "Test result",
        notes: "Minor injury. Conservative treatment.",
      },
      {
        patientIdNum: 10,
        date: "2024-01-14",
        doctor: "Dr. Ana Silva",
        diagnosis: "Hypertension",
        notes: "High blood pressure. Start medication.",
      },
      {
        patientIdNum: 10,
        date: "2024-02-18",
        doctor: "Dr. Ana Silva",
        diagnosis: "Follow-up",
        notes: "Blood pressure improved. Continue medication.",
      },
      {
        patientIdNum: 10,
        date: "2024-03-15",
        doctor: "Dr. Ana Silva",
        diagnosis: "Check-up",
        notes: "Blood pressure controlled.",
      },
    ];

    await db.collection("consultations").insertMany(
      consultations.map((c) => ({
        patientId: patientIdMap[c.patientIdNum],
        date: c.date,
        doctor: c.doctor,
        diagnosis: c.diagnosis,
        notes: c.notes,
        createdAt: new Date(),
      })),
    );

    return NextResponse.json(
      {
        message: "Database seeded successfully",
        patientsInserted: patientResult.insertedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 },
    );
  }
}
