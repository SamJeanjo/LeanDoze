import { randomBytes } from "node:crypto";
import { currentUser } from "@clerk/nextjs/server";
import { InviteStatus, InviteType, PatientAccessRole, UserRole } from "@prisma/client";
import { getDb } from "@/lib/db";

export type InviteApiErrorCode =
  | "INVALID_EMAIL"
  | "INVITE_ALREADY_PENDING"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INVALID_TYPE";

export type InviteResponse =
  | {
      success: true;
      invite: InviteDto;
      inviteLink: string;
      message: string;
    }
  | {
      success: false;
      code: InviteApiErrorCode;
      message: string;
      invite?: InviteDto;
      inviteLink?: string;
    };

export type InviteDto = {
  id: string;
  type: InviteType;
  email: string;
  status: InviteStatus;
  expiresAt: string;
  token: string;
  inviteLink: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function appUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3010";
}

export function inviteLinkFor(token: string) {
  return `${appUrl()}/invite/${token}`;
}

export function toInviteDto(invite: {
  id: string;
  type: InviteType;
  email: string;
  invitedEmail: string;
  status: InviteStatus;
  expiresAt: Date;
  token: string;
}): InviteDto {
  return {
    id: invite.id,
    type: invite.type,
    email: invite.invitedEmail || invite.email,
    status: invite.status,
    expiresAt: invite.expiresAt.toISOString(),
    token: invite.token,
    inviteLink: inviteLinkFor(invite.token),
  };
}

export async function getCurrentAppUser() {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? `${userId}@leandoze.local`;
  const firstName = clerkUser?.firstName ?? null;
  const lastName = clerkUser?.lastName ?? null;
  const db = getDb();

  return db.user.upsert({
    where: { id: userId },
    update: { email, firstName, lastName },
    create: { id: userId, email, firstName, lastName },
    include: {
      patientProfile: true,
      memberships: true,
    },
  });
}

async function sendInviteEmail(email: string, inviteLink: string) {
  if (!process.env.RESEND_API_KEY) {
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "LeanDoze <onboarding@resend.dev>",
      to: email,
      subject: "You've been invited to LeanDoze",
      html: `<p>You've been invited to LeanDoze.</p><p><a href="${inviteLink}">Accept invite</a></p><p>LeanDoze does not provide medical advice. Review summaries with your clinician.</p>`,
    }),
  });
}

export async function createInvite(input: {
  type: InviteType;
  invitedEmail: string;
  patientId?: string | null;
  clinicId?: string | null;
}): Promise<InviteResponse> {
  const db = getDb();
  const user = await getCurrentAppUser();

  if (!user) {
    return { success: false, code: "UNAUTHORIZED", message: "Sign in to send an invite." };
  }

  const email = normalizeEmail(input.invitedEmail);

  if (!isValidEmail(email)) {
    return { success: false, code: "INVALID_EMAIL", message: "Enter a valid email address." };
  }

  if (input.type === InviteType.CLINIC_TO_PATIENT) {
    const clinicId = input.clinicId || user.memberships[0]?.clinicId;
    const membership = clinicId
      ? user.memberships.find((item) => item.clinicId === clinicId)
      : null;

    if (!clinicId || !membership || (user.role !== UserRole.CLINIC_ADMIN && user.role !== UserRole.CLINIC_STAFF)) {
      return { success: false, code: "FORBIDDEN", message: "You do not have access to send clinic invites." };
    }

    const existing = await db.patientInvite.findFirst({
      where: {
        clinicId,
        invitedEmail: email,
        type: InviteType.CLINIC_TO_PATIENT,
        status: InviteStatus.PENDING,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return {
        success: false,
        code: "INVITE_ALREADY_PENDING",
        message: "This email already has a pending invite.",
        invite: toInviteDto(existing),
        inviteLink: inviteLinkFor(existing.token),
      };
    }

    const invite = await db.patientInvite.create({
      data: {
        type: InviteType.CLINIC_TO_PATIENT,
        status: InviteStatus.PENDING,
        token: randomBytes(32).toString("hex"),
        email,
        invitedEmail: email,
        clinicId,
        invitedByUserId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
    });
    const inviteLink = inviteLinkFor(invite.token);
    await sendInviteEmail(email, inviteLink);

    return { success: true, invite: toInviteDto(invite), inviteLink, message: `Invite sent to ${email}` };
  }

  if (input.type === InviteType.PATIENT_TO_CLINIC) {
    const patientId = input.patientId || user.patientProfile?.id;

    if (!patientId || user.patientProfile?.id !== patientId) {
      return { success: false, code: "FORBIDDEN", message: "You can only send invites for your own patient profile." };
    }

    const existing = await db.patientInvite.findFirst({
      where: {
        patientId,
        invitedEmail: email,
        type: InviteType.PATIENT_TO_CLINIC,
        status: InviteStatus.PENDING,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return {
        success: false,
        code: "INVITE_ALREADY_PENDING",
        message: "This email already has a pending invite.",
        invite: toInviteDto(existing),
        inviteLink: inviteLinkFor(existing.token),
      };
    }

    const invite = await db.patientInvite.create({
      data: {
        type: InviteType.PATIENT_TO_CLINIC,
        status: InviteStatus.PENDING,
        token: randomBytes(32).toString("hex"),
        email,
        invitedEmail: email,
        patientId,
        invitedByUserId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
    });
    const inviteLink = inviteLinkFor(invite.token);
    await sendInviteEmail(email, inviteLink);

    return { success: true, invite: toInviteDto(invite), inviteLink, message: `Invite sent to ${email}` };
  }

  return { success: false, code: "INVALID_TYPE", message: "Unsupported invite type." };
}

export async function listInvites(type?: InviteType) {
  const db = getDb();
  const user = await getCurrentAppUser();

  if (!user) {
    return null;
  }

  const where =
    type === InviteType.CLINIC_TO_PATIENT
      ? { clinicId: user.memberships[0]?.clinicId, type }
      : type === InviteType.PATIENT_TO_CLINIC
        ? { patientId: user.patientProfile?.id, type }
        : {
            OR: [
              ...user.memberships.map((membership) => ({ clinicId: membership.clinicId })),
              ...(user.patientProfile ? [{ patientId: user.patientProfile.id }] : []),
            ],
          };

  if (("clinicId" in where && !where.clinicId) || ("patientId" in where && !where.patientId)) {
    return [];
  }

  const invites = await db.patientInvite.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const latestByEmail = Array.from(
    invites
      .reduce((map, invite) => {
        const key = `${invite.type}:${invite.invitedEmail || invite.email}`;
        if (!map.has(key)) {
          map.set(key, invite);
        }
        return map;
      }, new Map<string, (typeof invites)[number]>())
      .values(),
  );

  return latestByEmail.map(toInviteDto);
}

export async function resendInvite(inviteId: string) {
  const db = getDb();
  const user = await getCurrentAppUser();

  if (!user) {
    return { success: false, code: "UNAUTHORIZED", message: "Sign in to resend an invite." } as const;
  }

  const invite = await db.patientInvite.findUnique({ where: { id: inviteId } });
  const canAccess =
    invite &&
    invite.status === InviteStatus.PENDING &&
    ((invite.clinicId && user.memberships.some((membership) => membership.clinicId === invite.clinicId)) ||
      (invite.patientId && user.patientProfile?.id === invite.patientId));

  if (!invite || !canAccess) {
    return { success: false, code: "NOT_FOUND", message: "Invite not found." } as const;
  }

  const inviteLink = inviteLinkFor(invite.token);
  await sendInviteEmail(invite.invitedEmail || invite.email, inviteLink);
  return { success: true, invite: toInviteDto(invite), inviteLink, message: "Invite resent." } as const;
}

export async function revokeInvite(inviteId: string) {
  const db = getDb();
  const user = await getCurrentAppUser();

  if (!user) {
    return { success: false, code: "UNAUTHORIZED", message: "Sign in to revoke an invite." } as const;
  }

  const invite = await db.patientInvite.findUnique({ where: { id: inviteId } });
  const canAccess =
    invite &&
    invite.status === InviteStatus.PENDING &&
    ((invite.clinicId && user.memberships.some((membership) => membership.clinicId === invite.clinicId)) ||
      (invite.patientId && user.patientProfile?.id === invite.patientId));

  if (!invite || !canAccess) {
    return { success: false, code: "NOT_FOUND", message: "Invite not found." } as const;
  }

  const updated = await db.patientInvite.update({
    where: { id: invite.id },
    data: { status: InviteStatus.REVOKED, revokedAt: new Date() },
  });

  return { success: true, invite: toInviteDto(updated), inviteLink: inviteLinkFor(updated.token), message: "Invite revoked." } as const;
}

export async function acceptInvite(token: string) {
  const db = getDb();
  const user = await getCurrentAppUser();

  if (!user) {
    return { success: false, code: "UNAUTHORIZED", message: "Sign in to accept this invite." } as const;
  }

  const invite = await db.patientInvite.findUnique({ where: { token } });

  if (!invite || invite.status !== InviteStatus.PENDING || invite.expiresAt < new Date()) {
    return { success: false, code: "NOT_FOUND", message: "Invite unavailable." } as const;
  }

  let patientId = invite.patientId;
  let clinicId = invite.clinicId;

  if (invite.type === InviteType.CLINIC_TO_PATIENT) {
    patientId = user.patientProfile?.id ?? null;
  }

  if (invite.type === InviteType.PATIENT_TO_CLINIC) {
    clinicId = user.memberships[0]?.clinicId ?? null;
  }

  if (!patientId || !clinicId) {
    return { success: false, code: "FORBIDDEN", message: "Complete the required LeanDoze workspace before accepting." } as const;
  }

  await db.$transaction([
    db.patientAccess.upsert({
      where: { patientId_clinicId: { patientId, clinicId } },
      update: { revokedAt: null, role: PatientAccessRole.CLINICIAN, grantedByInviteId: invite.id },
      create: { patientId, clinicId, role: PatientAccessRole.CLINICIAN, grantedByInviteId: invite.id },
    }),
    db.patientInvite.update({
      where: { id: invite.id },
      data: { status: InviteStatus.ACCEPTED, acceptedAt: new Date() },
    }),
  ]);

  return {
    success: true,
    redirectTo: invite.type === InviteType.CLINIC_TO_PATIENT ? "/app/dashboard" : "/clinic/dashboard",
  } as const;
}

