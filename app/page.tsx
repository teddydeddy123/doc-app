import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
        <p className="text-muted-foreground">Medical management system</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Consultations
            </CardTitle>
            <CardDescription>Manage your medical consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/consultations">Access Consultations</Link>
            </Button>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule
            </CardTitle>
            <CardDescription>
              View and manage your schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/agenda">Access Schedule</Link>
            </Button>
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patients
            </CardTitle>
            <CardDescription>Manage your patients</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/patients">Access Patients</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
