-- CreateEnum
CREATE TYPE "MedicationName" AS ENUM ('OZEMPIC', 'WEGOVY', 'MOUNJARO', 'ZEPBOUND', 'RYBELSUS', 'SAXENDA', 'OTHER');

-- CreateEnum
CREATE TYPE "DoseFrequency" AS ENUM ('DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "RiskFlagLevel" AS ENUM ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "RiskFlagStatus" AS ENUM ('OPEN', 'REVIEWED', 'RESOLVED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('PATIENT', 'CLINIC_ADMIN', 'CLINIC_STAFF');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TABLE "ClinicMembership" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PATIENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "MedicationPlan" DROP CONSTRAINT "MedicationPlan_patientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "DoseLog" DROP CONSTRAINT "DoseLog_patientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "DailyCheckIn" DROP CONSTRAINT "DailyCheckIn_patientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "WeightLog" DROP CONSTRAINT "WeightLog_patientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "SymptomLog" DROP CONSTRAINT "SymptomLog_patientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionLog" DROP CONSTRAINT "NutritionLog_patientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "HydrationLog" DROP CONSTRAINT "HydrationLog_patientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFlag" DROP CONSTRAINT "RiskFlag_patientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "RiskFlag" DROP CONSTRAINT "RiskFlag_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorReport" DROP CONSTRAINT "DoctorReport_patientProfileId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorReport" DROP CONSTRAINT "DoctorReport_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorReport" DROP CONSTRAINT "DoctorReport_createdByUserId_fkey";

-- DropIndex
DROP INDEX "User_clerkUserId_key";

-- DropIndex
DROP INDEX "Clinic_code_key";

-- DropIndex
DROP INDEX "MedicationPlan_patientProfileId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkUserId",
DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;

-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "code",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "ClinicMembership" DROP COLUMN "updatedAt",
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CLINIC_STAFF';

-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "currentWeight",
DROP COLUMN "goalWeight",
DROP COLUMN "hydrationGoal",
DROP COLUMN "proteinGoal",
ADD COLUMN     "goalWeightLb" DOUBLE PRECISION,
ADD COLUMN     "heightCm" DOUBLE PRECISION,
ADD COLUMN     "sex" TEXT,
ADD COLUMN     "startWeightLb" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "MedicationPlan" DROP COLUMN "doseAmount",
DROP COLUMN "injectionSchedule",
DROP COLUMN "lastDoseIncrease",
DROP COLUMN "medicationName",
DROP COLUMN "patientProfileId",
DROP COLUMN "status",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "customName" TEXT,
ADD COLUMN     "doseMg" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "frequency" "DoseFrequency" NOT NULL DEFAULT 'WEEKLY',
ADD COLUMN     "medication" "MedicationName" NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "nextDoseDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DoseLog" DROP COLUMN "doseAmount",
DROP COLUMN "dueDate",
DROP COLUMN "patientProfileId",
DROP COLUMN "status",
DROP COLUMN "takenAt",
ADD COLUMN     "doseMg" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "medicationPlanId" TEXT,
ADD COLUMN     "missed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "scheduledDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "taken" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "takenDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DailyCheckIn" DROP COLUMN "patientProfileId",
ADD COLUMN     "moodLevel" INTEGER,
ADD COLUMN     "patientId" TEXT NOT NULL,
ALTER COLUMN "checkInDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WeightLog" DROP COLUMN "patientProfileId",
DROP COLUMN "weight",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "weightLb" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "loggedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SymptomLog" DROP COLUMN "durationDays",
DROP COLUMN "patientProfileId",
DROP COLUMN "severity",
DROP COLUMN "symptom",
ADD COLUMN     "abdominalPain" "SymptomSeverity" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "constipation" "SymptomSeverity" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "diarrhea" "SymptomSeverity" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "fatigue" "SymptomSeverity" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "nausea" "SymptomSeverity" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "reflux" "SymptomSeverity" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "vomiting" "SymptomSeverity" NOT NULL DEFAULT 'NONE',
ALTER COLUMN "loggedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "NutritionLog" DROP COLUMN "mealNotes",
DROP COLUMN "patientProfileId",
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mealsLogged" INTEGER,
ADD COLUMN     "patientId" TEXT NOT NULL,
ALTER COLUMN "proteinGrams" DROP NOT NULL,
ALTER COLUMN "loggedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "HydrationLog" DROP COLUMN "hydrationOz",
DROP COLUMN "patientProfileId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ounces" INTEGER NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL,
ALTER COLUMN "loggedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RiskFlag" DROP COLUMN "clinicId",
DROP COLUMN "patientProfileId",
DROP COLUMN "severity",
DROP COLUMN "summary",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "level" "RiskFlagLevel" NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT,
ADD COLUMN     "status" "RiskFlagStatus" NOT NULL DEFAULT 'OPEN',
ALTER COLUMN "recommendation" DROP NOT NULL,
ALTER COLUMN "recommendation" DROP DEFAULT;

-- AlterTable
ALTER TABLE "DoctorReport" DROP COLUMN "clinicId",
DROP COLUMN "createdByUserId",
DROP COLUMN "patientProfileId",
DROP COLUMN "periodEnd",
DROP COLUMN "periodStart",
DROP COLUMN "reportJson",
DROP COLUMN "title",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "flagsSummary" TEXT,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "reportData" JSONB NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "ClinicRole";

-- DropEnum
DROP TYPE "PlanStatus";

-- DropEnum
DROP TYPE "DoseStatus";

-- DropEnum
DROP TYPE "RiskSeverity";

-- DropEnum
DROP TYPE "RiskFlagType";

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_slug_key" ON "Clinic"("slug");

-- CreateIndex
CREATE INDEX "ClinicMembership_clinicId_idx" ON "ClinicMembership"("clinicId");

-- CreateIndex
CREATE INDEX "PatientProfile_clinicId_idx" ON "PatientProfile"("clinicId");

-- CreateIndex
CREATE INDEX "MedicationPlan_patientId_idx" ON "MedicationPlan"("patientId");

-- CreateIndex
CREATE INDEX "MedicationPlan_active_idx" ON "MedicationPlan"("active");

-- CreateIndex
CREATE INDEX "DoseLog_patientId_idx" ON "DoseLog"("patientId");

-- CreateIndex
CREATE INDEX "DoseLog_scheduledDate_idx" ON "DoseLog"("scheduledDate");

-- CreateIndex
CREATE INDEX "DailyCheckIn_patientId_idx" ON "DailyCheckIn"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCheckIn_patientId_checkInDate_key" ON "DailyCheckIn"("patientId", "checkInDate");

-- CreateIndex
CREATE INDEX "WeightLog_patientId_idx" ON "WeightLog"("patientId");

-- CreateIndex
CREATE INDEX "WeightLog_loggedAt_idx" ON "WeightLog"("loggedAt");

-- CreateIndex
CREATE INDEX "SymptomLog_patientId_idx" ON "SymptomLog"("patientId");

-- CreateIndex
CREATE INDEX "SymptomLog_loggedAt_idx" ON "SymptomLog"("loggedAt");

-- CreateIndex
CREATE INDEX "NutritionLog_patientId_idx" ON "NutritionLog"("patientId");

-- CreateIndex
CREATE INDEX "NutritionLog_loggedAt_idx" ON "NutritionLog"("loggedAt");

-- CreateIndex
CREATE INDEX "HydrationLog_patientId_idx" ON "HydrationLog"("patientId");

-- CreateIndex
CREATE INDEX "HydrationLog_loggedAt_idx" ON "HydrationLog"("loggedAt");

-- CreateIndex
CREATE INDEX "RiskFlag_patientId_idx" ON "RiskFlag"("patientId");

-- CreateIndex
CREATE INDEX "RiskFlag_level_idx" ON "RiskFlag"("level");

-- CreateIndex
CREATE INDEX "RiskFlag_status_idx" ON "RiskFlag"("status");

-- CreateIndex
CREATE INDEX "DoctorReport_patientId_idx" ON "DoctorReport"("patientId");

-- CreateIndex
CREATE INDEX "DoctorReport_createdAt_idx" ON "DoctorReport"("createdAt");

-- AddForeignKey
ALTER TABLE "MedicationPlan" ADD CONSTRAINT "MedicationPlan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoseLog" ADD CONSTRAINT "DoseLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoseLog" ADD CONSTRAINT "DoseLog_medicationPlanId_fkey" FOREIGN KEY ("medicationPlanId") REFERENCES "MedicationPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyCheckIn" ADD CONSTRAINT "DailyCheckIn_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightLog" ADD CONSTRAINT "WeightLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLog" ADD CONSTRAINT "NutritionLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HydrationLog" ADD CONSTRAINT "HydrationLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomLog" ADD CONSTRAINT "SymptomLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFlag" ADD CONSTRAINT "RiskFlag_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorReport" ADD CONSTRAINT "DoctorReport_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

