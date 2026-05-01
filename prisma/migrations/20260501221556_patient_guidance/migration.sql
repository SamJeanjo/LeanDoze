-- AlterTable
ALTER TABLE "DailyCheckIn" ADD COLUMN     "bowelMovement" BOOLEAN,
ADD COLUMN     "movementMinutes" INTEGER,
ADD COLUMN     "strengthTraining" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PatientProfile" ADD COLUMN     "mainConcerns" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "GuidanceMessage" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuidanceMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuidanceMessage_patientId_idx" ON "GuidanceMessage"("patientId");

-- CreateIndex
CREATE INDEX "GuidanceMessage_date_idx" ON "GuidanceMessage"("date");

-- CreateIndex
CREATE INDEX "GuidanceMessage_priority_idx" ON "GuidanceMessage"("priority");

-- AddForeignKey
ALTER TABLE "GuidanceMessage" ADD CONSTRAINT "GuidanceMessage_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
