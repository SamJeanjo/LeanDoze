import { InviteType } from "@prisma/client";
import { NextResponse } from "next/server";
import { createInvite, listInvites } from "@/lib/invite-service";

function inviteType(value: unknown) {
  return value === InviteType.CLINIC_TO_PATIENT || value === InviteType.PATIENT_TO_CLINIC
    ? value
    : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = inviteType(searchParams.get("type"));
  const invites = await listInvites(type ?? undefined);

  if (invites === null) {
    return NextResponse.json({ success: false, code: "UNAUTHORIZED", message: "Sign in to view invites." }, { status: 401 });
  }

  return NextResponse.json({ success: true, invites });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const type = inviteType(body.type);

  if (!type) {
    return NextResponse.json({ success: false, code: "INVALID_TYPE", message: "Unsupported invite type." }, { status: 400 });
  }

  const result = await createInvite({
    type,
    invitedEmail: String(body.invitedEmail ?? ""),
    patientId: body.patientId ? String(body.patientId) : null,
    clinicId: body.clinicId ? String(body.clinicId) : null,
  });
  const status = result.success ? 200 : result.code === "UNAUTHORIZED" ? 401 : result.code === "FORBIDDEN" ? 403 : 400;

  return NextResponse.json(result, { status });
}

