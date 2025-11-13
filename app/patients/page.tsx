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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Search, RefreshCw } from "lucide-react";

// Patient type matching MongoDB structure
type Patient = {
  _id?: string;
  id?: number;
  name: string;
  age: number;
  email: string;
  phone: string;
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
    setIsDialogOpen(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
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

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">Manage your patients</p>
      </div>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>
              Click on a row to view details and history
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh patients list"
            className="cursor-pointer"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading patients...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search patient by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/100 border-b-black border-b-1">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <TableRow
                          key={patient._id || patient.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(patient)}
                        >
                          <TableCell className="font-medium">
                            {patient.name}
                          </TableCell>
                          <TableCell>{patient.age} years</TableCell>
                          <TableCell>{patient.email}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground py-8"
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              View medical history and edit patient information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Patient Information Form */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Patient Information</h3>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditClick}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={editedAge}
                    onChange={(e) =>
                      setEditedAge(parseInt(e.target.value) || 0)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
              {selectedPatient && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={selectedPatient.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={selectedPatient.phone} disabled />
                  </div>
                </div>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveChanges}
                    className="w-full md:w-auto"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="w-full md:w-auto"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Consultation History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Consultation History</h3>
              {consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <Card key={consultation._id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {consultation.date}
                            </CardTitle>
                            <CardDescription>
                              {consultation.doctor}
                            </CardDescription>
                          </div>
                          <div className="text-sm font-medium text-primary">
                            {consultation.diagnosis}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {consultation.notes}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No consultations registered for this patient.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
