import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { getOrCreateCurrentUser } from "@/lib/app-data";

export default async function ClinicIndex() {
  const { user } = await getOrCreateCurrentUser();

  if (user.role === UserRole.PATIENT && user.memberships.length === 0) {
    redirect("/app/dashboard");
  }

  redirect("/clinic/dashboard");
}
