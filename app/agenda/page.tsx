import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AgendaPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/70 bg-white/80 p-6  backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">
          Clinical schedule
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Schedule
        </h1>
        <p className="text-slate-600">
          Plan daily rounds, follow-ups, and reminders for your care team.
        </p>
      </div>
      <Card className="border border-white/70 bg-white/80 shadow-lg shadow-sky-100/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            Appointment overview
          </CardTitle>
          <CardDescription className="text-slate-600">
            Calendar of upcoming appointments and tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Connect your scheduling tool or add consultations to see them here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

