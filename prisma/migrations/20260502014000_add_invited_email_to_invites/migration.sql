-- AlterTable
ALTER TABLE "PatientInvite" ADD COLUMN IF NOT EXISTS "invitedEmail" TEXT NOT NULL DEFAULT '';

-- Backfill existing invites so new duplicate checks work with old rows.
UPDATE "PatientInvite"
SET "invitedEmail" = LOWER(TRIM("email"))
WHERE "invitedEmail" = '';
