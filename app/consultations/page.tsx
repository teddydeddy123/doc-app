import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConsultationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
        <p className="text-muted-foreground">
          Manage your medical consultations
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Consultations</CardTitle>
          <CardDescription>List of medical consultations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your consultations will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
