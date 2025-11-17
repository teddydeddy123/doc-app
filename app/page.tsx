import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Stethoscope, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6 rounded-3xl border border-white/60 bg-white/70 p-8 ">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-sky-100/70 px-3 py-1 text-sm font-medium text-sky-700">
          <Stethoscope className="h-4 w-4" />
          Care Coordination
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Welcome back, Doctor
        </h1>
        <p className="text-slate-600">
          Keep consultations, schedules, and patient history organized in one
          calm workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-sky-100/70 bg-gradient-to-br from-white via-sky-50 to-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky-600" />
              Consultations
            </CardTitle>
            <CardDescription className="text-slate-600">
              Manage your medical consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="w-full bg-sky-600 text-white hover:bg-sky-500"
            >
              <Link href="/consultations">Access Consultations</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-cyan-100/70 bg-gradient-to-br from-white via-cyan-50 to-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-700" />
              Schedule
            </CardTitle>
            <CardDescription className="text-slate-600">
              View and manage your schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="w-full border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50"
              variant="outline"
            >
              <Link href="/agenda">Access Schedule</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-emerald-100/70 bg-gradient-to-br from-white via-emerald-50 to-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Patients
            </CardTitle>
            <CardDescription className="text-slate-600">
              Manage your patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="w-full border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
              variant="outline"
            >
              <Link href="/patients">Access Patients</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
