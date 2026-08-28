-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('EMPLOYER', 'CANDIDATE', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CandidateGender" AS ENUM ('male', 'female', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "JobSeekingStatus" AS ENUM ('active', 'open', 'passive');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CANDIDATE',
    "passwordHash" TEXT,
    "company" TEXT,
    "accountStatus" TEXT NOT NULL DEFAULT 'active',
    "companyProfile" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CandidateProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desiredPosition" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "provinceCode" TEXT NOT NULL,
    "wardCode" TEXT NOT NULL,
    "wardName" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "gender" "CandidateGender" NOT NULL DEFAULT 'other',
    "languages" TEXT[],
    "education" TEXT NOT NULL,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "skills" TEXT[],
    "summary" TEXT NOT NULL,
    "age" INTEGER NOT NULL DEFAULT 25,
    "salaryExpect" INTEGER NOT NULL DEFAULT 10,
    "workType" TEXT NOT NULL DEFAULT 'Toàn thời gian',
    "jobSeekingStatus" "JobSeekingStatus" NOT NULL DEFAULT 'open',
    "interestCount" INTEGER NOT NULL DEFAULT 0,
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "originalFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EmployerCandidateView" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployerCandidateView_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ContactUnlock" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactUnlock_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SavedCandidate" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedCandidate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EmployerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EmployerProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EmployerSubscription" (
    "employerId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "cvUsed" INTEGER NOT NULL DEFAULT 0,
    "cvLimit" INTEGER,
    "cvUsedToday" INTEGER NOT NULL DEFAULT 0,
    "cvUsageDay" TEXT,
    "activatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "activationVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastFreeActivatedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployerSubscription_pkey" PRIMARY KEY ("employerId")
);

CREATE UNIQUE INDEX IF NOT EXISTS "EmployerProfile_userId_key" ON "EmployerProfile"("userId");

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "CandidateProfile_userId_key" ON "CandidateProfile"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "CandidateProfile_slug_key" ON "CandidateProfile"("slug");
CREATE INDEX IF NOT EXISTS "CandidateProfile_isPublic_updatedAt_idx" ON "CandidateProfile"("isPublic", "updatedAt" DESC);
CREATE INDEX IF NOT EXISTS "CandidateProfile_isPublic_interestCount_idx" ON "CandidateProfile"("isPublic", "interestCount" DESC);
CREATE INDEX IF NOT EXISTS "CandidateProfile_isPublic_provinceCode_industryId_updatedAt_idx" ON "CandidateProfile"("isPublic", "provinceCode", "industryId", "updatedAt" DESC);
CREATE INDEX IF NOT EXISTS "CandidateProfile_isPublic_wardCode_idx" ON "CandidateProfile"("isPublic", "wardCode");
CREATE INDEX IF NOT EXISTS "CandidateProfile_isPublic_jobSeekingStatus_updatedAt_idx" ON "CandidateProfile"("isPublic", "jobSeekingStatus", "updatedAt" DESC);
CREATE INDEX IF NOT EXISTS "CandidateProfile_isPublic_gender_idx" ON "CandidateProfile"("isPublic", "gender");
CREATE INDEX IF NOT EXISTS "CandidateProfile_isPublic_education_idx" ON "CandidateProfile"("isPublic", "education");
CREATE INDEX IF NOT EXISTS "CandidateProfile_isPublic_workType_idx" ON "CandidateProfile"("isPublic", "workType");
CREATE INDEX IF NOT EXISTS "CandidateProfile_isPublic_experienceYears_idx" ON "CandidateProfile"("isPublic", "experienceYears");
CREATE INDEX IF NOT EXISTS "CandidateProfile_desiredPosition_idx" ON "CandidateProfile"("desiredPosition");
CREATE INDEX IF NOT EXISTS "EmployerCandidateView_employerId_viewedAt_idx" ON "EmployerCandidateView"("employerId", "viewedAt");
CREATE INDEX IF NOT EXISTS "EmployerCandidateView_candidateId_idx" ON "EmployerCandidateView"("candidateId");
CREATE UNIQUE INDEX IF NOT EXISTS "EmployerCandidateView_employerId_candidateId_key" ON "EmployerCandidateView"("employerId", "candidateId");
CREATE INDEX IF NOT EXISTS "ContactUnlock_employerId_unlockedAt_idx" ON "ContactUnlock"("employerId", "unlockedAt");
CREATE INDEX IF NOT EXISTS "ContactUnlock_candidateId_idx" ON "ContactUnlock"("candidateId");
CREATE UNIQUE INDEX IF NOT EXISTS "ContactUnlock_employerId_candidateId_key" ON "ContactUnlock"("employerId", "candidateId");
CREATE INDEX IF NOT EXISTS "SavedCandidate_employerId_savedAt_idx" ON "SavedCandidate"("employerId", "savedAt");
CREATE INDEX IF NOT EXISTS "SavedCandidate_candidateId_idx" ON "SavedCandidate"("candidateId");
CREATE UNIQUE INDEX IF NOT EXISTS "SavedCandidate_employerId_candidateId_key" ON "SavedCandidate"("employerId", "candidateId");

DO $$ BEGIN
  ALTER TABLE "CandidateProfile" ADD CONSTRAINT "CandidateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "EmployerCandidateView" ADD CONSTRAINT "EmployerCandidateView_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "ContactUnlock" ADD CONSTRAINT "ContactUnlock_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "SavedCandidate" ADD CONSTRAINT "SavedCandidate_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "EmployerProfile" ADD CONSTRAINT "EmployerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Migrate User columns on existing DBs
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "company" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accountStatus" TEXT NOT NULL DEFAULT 'active';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "companyProfile" JSONB;

CREATE TABLE IF NOT EXISTS "PaymentOrder" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "employerEmail" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "originalAmount" INTEGER,
    "promoCode" TEXT,
    "durationDays" INTEGER NOT NULL DEFAULT 0,
    "cvLimit" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sepayTxnId" TEXT,
    "transferAmount" INTEGER,
    "gateway" TEXT,
    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PaymentOrder_code_key" ON "PaymentOrder"("code");
CREATE INDEX IF NOT EXISTS "PaymentOrder_employerId_createdAt_idx" ON "PaymentOrder"("employerId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "PaymentOrder_status_idx" ON "PaymentOrder"("status");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

CREATE TABLE IF NOT EXISTS "SePayProcessed" (
    "id" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SePayProcessed_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SystemSetting" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "siteName" TEXT NOT NULL,
    "supportEmail" TEXT NOT NULL,
    "supportPhone" TEXT NOT NULL,
    "allowEmployerSignup" BOOLEAN NOT NULL DEFAULT true,
    "maintenance" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ServicePlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "durationLabel" TEXT NOT NULL,
    "cvLimit" INTEGER,
    "cvLimitLabel" TEXT NOT NULL,
    "cvPerDay" INTEGER,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[] NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServicePlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Promotion" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountLabel" TEXT NOT NULL,
    "expiresAt" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sortOrder" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "planIds" TEXT[] NOT NULL,
    "discountType" TEXT,
    "discountValue" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Promotion_code_key" ON "Promotion"("code");
CREATE INDEX IF NOT EXISTS "Promotion_status_idx" ON "Promotion"("status");

CREATE TABLE IF NOT EXISTS "DeliveryJob" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "industryId" TEXT NOT NULL DEFAULT '',
    "provinceCode" TEXT NOT NULL,
    "wardCode" TEXT NOT NULL DEFAULT '',
    "gender" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT '',
    "ageRange" TEXT NOT NULL DEFAULT '',
    "delivery" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "matchedCandidateIds" TEXT[] NOT NULL,
    "matchedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    CONSTRAINT "DeliveryJob_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "DeliveryJob_employerId_createdAt_idx" ON "DeliveryJob"("employerId", "createdAt" DESC);

CREATE TABLE IF NOT EXISTS "EmailCampaign" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "employerEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "openedWithin" TEXT,
    "status" TEXT NOT NULL,
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "testMode" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "results" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EmailCampaign_employerId_sentAt_idx" ON "EmailCampaign"("employerId", "sentAt" DESC);
