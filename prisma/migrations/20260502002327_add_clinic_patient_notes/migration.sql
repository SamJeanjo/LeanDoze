-- CreateTable
CREATE TABLE "ClinicPatientNote" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicPatientNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClinicPatientNote_patientId_idx" ON "ClinicPatientNote"("patientId");

-- CreateIndex
CREATE INDEX "ClinicPatientNote_clinicId_idx" ON "ClinicPatientNote"("clinicId");

-- CreateIndex
CREATE INDEX "ClinicPatientNote_createdAt_idx" ON "ClinicPatientNote"("createdAt");

-- AddForeignKey
ALTER TABLE "ClinicPatientNote" ADD CONSTRAINT "ClinicPatientNote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicPatientNote" ADD CONSTRAINT "ClinicPatientNote_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicPatientNote" ADD CONSTRAINT "ClinicPatientNote_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
