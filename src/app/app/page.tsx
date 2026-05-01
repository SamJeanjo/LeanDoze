import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { getOrCreateCurrentUser } from "@/lib/app-data";

export default async function PatientAppIndex() {
  const { user } = await getOrCreateCurrentUser();

  if (user.role === UserRole.CLINIC_ADMIN || user.role === UserRole.CLINIC_STAFF || user.memberships.length > 0) {
    redirect("/clinic/dashboard");
  }

  redirect("/app/dashboard");
}
