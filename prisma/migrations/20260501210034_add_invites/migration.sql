-- CreateEnum
CREATE TYPE "InviteType" AS ENUM ('PATIENT_TO_CLINIC', 'CLINIC_TO_PATIENT');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "PatientAccessRole" AS ENUM ('VIEWER', 'CLINICIAN', 'ADMIN');

-- AlterTable
ALTER TABLE "PatientProfile" ADD COLUMN     "hydrationGoalOz" INTEGER NOT NULL DEFAULT 90,
ADD COLUMN     "proteinGoalGrams" INTEGER NOT NULL DEFAULT 120;

-- CreateTable
CREATE TABLE "PatientInvite" (
    "id" TEXT NOT NULL,
    "type" "InviteType" NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "patientId" TEXT,
    "clinicId" TEXT,
    "invitedByUserId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientAccess" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "role" "PatientAccessRole" NOT NULL DEFAULT 'CLINICIAN',
    "grantedByInviteId" TEXT,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientInvite_token_key" ON "PatientInvite"("token");

-- CreateIndex
CREATE INDEX "PatientInvite_email_idx" ON "PatientInvite"("email");

-- CreateIndex
CREATE INDEX "PatientInvite_token_idx" ON "PatientInvite"("token");

-- CreateIndex
CREATE INDEX "PatientInvite_patientId_idx" ON "PatientInvite"("patientId");

-- CreateIndex
CREATE INDEX "PatientInvite_clinicId_idx" ON "PatientInvite"("clinicId");

-- CreateIndex
CREATE INDEX "PatientInvite_status_idx" ON "PatientInvite"("status");

-- CreateIndex
CREATE INDEX "PatientAccess_patientId_idx" ON "PatientAccess"("patientId");

-- CreateIndex
CREATE INDEX "PatientAccess_clinicId_idx" ON "PatientAccess"("clinicId");

-- CreateIndex
CREATE INDEX "PatientAccess_revokedAt_idx" ON "PatientAccess"("revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PatientAccess_patientId_clinicId_key" ON "PatientAccess"("patientId", "clinicId");

-- AddForeignKey
ALTER TABLE "PatientInvite" ADD CONSTRAINT "PatientInvite_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientInvite" ADD CONSTRAINT "PatientInvite_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientInvite" ADD CONSTRAINT "PatientInvite_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAccess" ADD CONSTRAINT "PatientAccess_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAccess" ADD CONSTRAINT "PatientAccess_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
