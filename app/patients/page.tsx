"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Search, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Patient type matching MongoDB structure
type Patient = {
  _id?: string;
  id?: number;
  name: string;
  age: number;
  createdAt?: string;
  updatedAt?: string;
  status?: "active" | "ongoing" | "overdue" | "completed";
  lastVisit?: string; // ISO date string
};

type Consultation = {
  _id?: string;
  patientId: string;
  date: string;
  doctor: string;
  diagnosis: string;
  notes: string;
};

export default function PatientsPage() {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedAge, setEditedAge] = useState(0);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showConsultationHistory, setShowConsultationHistory] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "ongoing" | "overdue" | "completed"
  >("all");
  const [lastVisitFilter, setLastVisitFilter] = useState<string>("");
  const [expandedAvatarId, setExpandedAvatarId] = useState<string | number | null>(null);

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/patients");
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        console.error("Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch patients (for refresh button)
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/patients");
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        console.error("Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch consultations when a patient is selected
  useEffect(() => {
    const fetchConsultations = async () => {
      if (!selectedPatient) {
        setConsultations([]);
        return;
      }

      const patientId = selectedPatient._id || selectedPatient.id?.toString();
      if (!patientId) return;

      try {
        const response = await fetch(
          `/api/patients/${patientId}/consultations`,
        );
        if (response.ok) {
          const data = await response.json();
          setConsultations(data);
        } else {
          console.error("Failed to fetch consultations");
          setConsultations([]);
        }
      } catch (error) {
        console.error("Error fetching consultations:", error);
        setConsultations([]);
      }
    };

    fetchConsultations();
  }, [selectedPatient]);

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditedName(patient.name);
    setEditedAge(patient.age);
    setIsEditing(false);
    setShowConsultationHistory(true);
    setIsDialogOpen(true);
  };



  const handleSaveChanges = async () => {
    if (!selectedPatient) return;

    const patientId = selectedPatient._id || selectedPatient.id?.toString();
    if (!patientId) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName,
          age: editedAge,
        }),
      });

      if (response.ok) {
        const updatedPatient = await response.json();

        // Update patients list
        setPatients(
          patients.map((p) => {
            const pId = p._id || p.id?.toString();
            return pId === patientId ? updatedPatient : p;
          }),
        );

        setSelectedPatient(updatedPatient);
        setIsEditing(false);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Failed to update patient:", response.status, errorData);
        alert(`Error saving changes: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      alert(
        `Error saving changes: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!selectedPatient) return;
    setEditedName(selectedPatient.name);
    setEditedAge(selectedPatient.age);
    setIsEditing(false);
  };

  // Helpers
  // const formatShortDate = (iso?: string) => {
  //   if (!iso) return "—";
  //   try {
  //     const d = new Date(iso);
  //     const dd = String(d.getDate()).padStart(2, "0");
  //     const mm = String(d.getMonth() + 1).padStart(2, "0");
  //     const yyyy = d.getFullYear();
  //     return `${dd}.${mm}.${yyyy}`;
  //   } catch {
  //     return "—";
  //   }
  // };

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

  const shortId = (p: Patient) =>
    p._id ? `PT-${p._id.slice(-4)}` : p.id ? `PT-${String(p.id).padStart(4, "0")}` : "PT—";

  const statusBadgeClasses = (status?: Patient["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "ongoing":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
      case "overdue":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
      case "completed":
        return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
      default:
        return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    }
  };

  // Filter patients based on search, status and last visit
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : patient.status === statusFilter;
    const matchesLastVisit = lastVisitFilter
      ? (() => {
          try {
            const selected = new Date(lastVisitFilter).getTime();
            const lv = patient.lastVisit ? new Date(patient.lastVisit).getTime() : 0;
            return lv >= selected;
          } catch {
            return true;
          }
        })()
      : true;
    return matchesSearch && matchesStatus && matchesLastVisit;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 pt-0  backdrop-blur">
       
        <h1 className="text-3xl font-bold tracking-tight text-sky-600">
          Patients
        </h1>
        <p className="text-slate-600">
          Manage patient data, update profiles, and review consultation history.
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
        <Card 
          className="border border-white/60 backdrop-blur-xl shadow-lg overflow-hidden"
          style={{ background: 'linear-gradient(301deg, rgb(74 149 255 / 26%), rgb(22 93 252 / 0%))' }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">
                Active Patients
              </CardTitle>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                <span className="size-2 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-sky-600">
                {patients.filter((p) => p.status === "active").length}
              </span>
              <span className="text-sm text-slate-500">patients</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border border-white/60 backdrop-blur-xl shadow-lg overflow-hidden"
          style={{ background: 'linear-gradient(301deg, rgb(74 149 255 / 26%), rgb(22 93 252 / 0%))' }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">
                Overdue Patients
              </CardTitle>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200">
                <span className="size-2 rounded-full bg-rose-500" />
                Overdue
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-rose-600">
                {patients.filter((p) => p.status === "overdue").length}
              </span>
              <span className="text-sm text-slate-500">patients</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border border-white/70 bg-white/80 shadow-lg shadow-sky-100/40 backdrop-blur">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Button className="h-9 rounded-xl bg-[#155dfc] hover:bg-[#0e46c7] text-white">
            + Add patient
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh patients list"
            className="h-9 w-9 border-sky-200 bg-white text-sky-600 hover:bg-sky-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sky-700">
              Loading patients...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search patient by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white pl-9 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-400"
                  />
                </div>
                <div className="flex items-center gap-2 md:w-[280px]">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as typeof statusFilter)
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="overdue">Overdue</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 md:w-[240px]">
                  <Input
                    type="date"
                    value={lastVisitFilter}
                    onChange={(e) => setLastVisitFilter(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="border-b border-slate-200">
                    <TableRow className="text-slate-600 bg-blue-50">
                      <TableHead>Patient</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Last visit</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <TableRow
                          key={patient._id || patient.id}
                          className="cursor-pointer hover:bg-slate-50/80"
                          onClick={() => handleRowClick(patient)}
                        >
                          <TableCell className="font-medium text-slate-900">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const id = patient._id || patient.id!;
                                    setExpandedAvatarId((prev) =>
                                      prev === id ? null : id,
                                    );
                                  }}
                                  aria-label="Expand avatar"
                                  className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-transform hover:scale-110 ${colorForName(
                                    patient.name,
                                  )}`}
                                >
                                  {getInitials(patient.name)}
                                </button>
                                {expandedAvatarId === (patient._id || patient.id) && (
                                  <div className="absolute left-9 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg ring-1 ring-slate-200">
                                    <div
                                      className={`flex size-25 items-center justify-center rounded-full text-lg font-semibold ${colorForName(
                                        patient.name,
                                      )}`}
                                    >
                                      {getInitials(patient.name)}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">
                                  {patient.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {shortId(patient)}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {patient.age} years
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {(patient.lastVisit)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClasses(
                                patient.status,
                              )}`}
                            >
                              <span
                                className={`size-2 rounded-full ${
                                  patient.status === "active"
                                    ? "bg-emerald-500"
                                    : patient.status === "ongoing"
                                      ? "bg-blue-500"
                                      : patient.status === "overdue"
                                        ? "bg-rose-500"
                                        : "bg-slate-400"
                                }`}
                              />
                              {patient.status
                                ? patient.status[0].toUpperCase() +
                                  patient.status.slice(1)
                                : "Active"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="py-8 text-center text-slate-600"
                        >
                          {searchQuery
                            ? "No patients found"
                            : "No patients registered"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      + <DialogContent 
        style={{ backgroundColor: "#eff6ff" }}

className="max-w-5xl max-h-[90vh] overflow-y-auto border-0  backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start justify-between border-b border-teal-200/50 pb-4">
            {selectedPatient && (
              <div
                className={`flex size-20 items-center justify-center rounded-full text-2xl font-semibold ${colorForName(
                  selectedPatient.name,
                )}`}
              >
                {getInitials(selectedPatient.name)}
              </div>
            )}
            
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Basic Data */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-600 mb-3">
                Basic Data
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    disabled={!isEditing}
                    className="bg-white/80 border-teal-200 focus:border-teal-400 disabled:bg-[#dfe9e9]/50 disabled:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-slate-700 font-medium">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={editedAge}
                    onChange={(e) =>
                      setEditedAge(parseInt(e.target.value) || 0)
                    }
                    disabled={!isEditing}
                    className="bg-white/80 border-teal-200 focus:border-teal-400 disabled:bg-[#dfe9e9]/50 disabled:text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Consultation History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                  Consultation History
                </h3>
               {showConsultationHistory && <p className="text-xs text-slate-600 mt-1">Latest consultations</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setShowConsultationHistory((prevState) => !prevState)
                  }
                  aria-expanded={showConsultationHistory}
                  className="h-7 w-7 text-sky-500 hover:bg-teal-50/80 rounded-full"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showConsultationHistory ? "-rotate-180" : "-rotate-360"
                    }`}
                  />
                </Button>
              </div>
              {showConsultationHistory && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {consultations.length > 0 ? (
                    consultations.map((consultation) => (
                      <Card
                        key={consultation._id}
                        className="bg-white/70 border-teal-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-sm font-semibold text-slate-900 mb-1">
                                {consultation.date}
                              </CardTitle>
                              <CardDescription className="text-xs text-sky-500">
                                {consultation.doctor}
                              </CardDescription>
                            </div>
                            <div className="text-xs font-semibold text-sky-600 bg-teal-50/80 px-2 py-1 rounded">
                              {consultation.diagnosis}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {consultation.notes}
                          </p>
                        </CardContent>

                      </Card>
                    ))
                    
                  ) : (
                    <p className="text-sm text-slate-500 italic ">
                      No consultations registered for this patient.
                    </p>
                  )}
                                          {consultations.length > 1 && (
                                            <Link
                                            href={`/patients/${selectedPatient?._id || selectedPatient?.id}`}
                                              className="text-xs text-blue-600 mt-4 font-bold cursor-pointer hover:text-blue-700 hover:underline"
                                            >
                                              See all consultations
                                            </Link>
                                          )}

                </div>
              )}
            </div>
          </div>

          {/* Footer with Action Buttons */}
          {!isEditing && (
               <Button
               onClick={() =>setIsEditing(true)}
               className="flex-1 text-white mt-6" 
               disabled={saving}
             >
              Edit information
              </Button>
            )}
          {isEditing && (
            <div className="flex gap-3 border-t border-teal-200/50 mt-6">
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                className="flex-1  text-white"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
