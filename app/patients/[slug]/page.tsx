"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

type Patient = {
  _id?: string;
  id?: number;
  name: string;
  age: number;
  createdAt?: string;
  updatedAt?: string;
  status?: "active" | "ongoing" | "overdue" | "completed";
  lastVisit?: string;
};

type Consultation = {
  _id?: string;
  patientId: string;
  date: string;
  doctor: string;
  diagnosis: string;
  notes: string;
};

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"future" | "past" | "planned">(
    "past",
  );

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const [patientRes, consultationsRes] = await Promise.all([
          fetch(`/api/patients/${slug}`),
          fetch(`/api/patients/${slug}/consultations`),
        ]);

        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatient(patientData);
        }

        if (consultationsRes.ok) {
          const consultationsData = await consultationsRes.json();
          setConsultations(consultationsData);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPatientData();
    }
  }, [slug]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase();
  };

  const colorForName = (name: string) => {
    const palette = [
      "bg-amber-100 text-amber-700",
      "bg-emerald-100 text-emerald-700",
      "bg-sky-100 text-sky-700",
      "bg-violet-100 text-violet-700",
      "bg-rose-100 text-rose-700",
      "bg-cyan-100 text-cyan-700",
    ] as const;
    const sum = Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return palette[sum % palette.length];
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // Separate consultations into past and future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastConsultations = consultations.filter((c) => {
    const consultDate = new Date(c.date);
    consultDate.setHours(0, 0, 0, 0);
    return consultDate < today;
  });

  const futureConsultations = consultations.filter((c) => {
    const consultDate = new Date(c.date);
    consultDate.setHours(0, 0, 0, 0);
    return consultDate >= today;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600">Loading patient profile...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600">Patient not found</div>
      </div>
    );
  }

  const birthYear = new Date().getFullYear() - patient.age;


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Patient profile</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300">
            PRINT
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            EDIT
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex gap-4">
        {/* Left Column */}
        <div className="space-y-6 w-1/2">
          {/* Patient Information Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <div
                  className={`flex size-20 items-center justify-center rounded-full text-2xl font-semibold ${colorForName(
                    patient.name,
                  )}`}
                >
                  {getInitials(patient.name)}
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {patient.name}
                  </h2>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>+38 (093) 23 45 678</p>
                    <p>katepro@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">
                    General information
                  </h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date of birth:</span>
                    <span className="font-medium text-slate-900">
                      {formatDate(`${birthYear}-07-23`)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Address:</span>
                    <span className="font-medium text-slate-900">
                      Lviv, Chornovola street, 67
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Registration Date:</span>
                    <span className="font-medium text-slate-900">
                      {formatDate(patient.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
      </div>
      {/* Visits Section */}
      <Card className="shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Visits</CardTitle>
          </div>
          <div className="flex gap-2 mt-4 border-b">
            <button
              onClick={() => setActiveTab("future")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "future"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Future visits ({futureConsultations.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "past"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Past visits ({pastConsultations.length})
            </button>
            <button
              onClick={() => setActiveTab("planned")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "planned"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Planned treatments (0)
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTab === "future" &&
              (futureConsultations.length > 0 ? (
                futureConsultations.map((consultation) => (
                  <div
                    key={consultation._id}
                    className="flex items-start justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-900">
                          11.00-12.30
                        </span>
                        <span className="text-sm text-slate-600">
                          {formatDate(consultation.date)}
                        </span>
                      </div>
                      <p className="font-medium text-slate-900">
                        {consultation.diagnosis}
                      </p>
                      <p className="text-sm text-slate-600">
                        Doctor: {consultation.doctor}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                      Scheduled
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No future visits scheduled
                </p>
              ))}

            {activeTab === "past" &&
              (pastConsultations.length > 0 ? (
                pastConsultations.map((consultation) => (
                  <div
                    key={consultation._id}
                    className="flex items-start justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-900">
                          11.00-12.30
                        </span>
                        <span className="text-sm text-slate-600">
                          {formatDate(consultation.date)}
                        </span>
                      </div>
                      <p className="font-medium text-slate-900">
                        {consultation.diagnosis}
                      </p>
                      <p className="text-sm text-slate-600">
                        Doctor: {consultation.doctor}
                      </p>
                      {consultation.notes && (
                        <p className="text-xs text-slate-500 mt-1">
                          {consultation.notes}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      Completed
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No past visits recorded
                </p>
              ))}

            {activeTab === "planned" && (
              <p className="text-sm text-slate-500 italic">
                No planned treatments
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
