-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Occasion" AS ENUM ('WEDDING', 'BIRTHDAY', 'ENGAGEMENT', 'BABY_SHOWER', 'HOUSEWARMING', 'NAMING_CEREMONY', 'OTHER');

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "occasion" "Occasion" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "previewUrl" TEXT NOT NULL,
    "designJson" JSONB NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "status" "TemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "templateId" TEXT,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "designJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");
CREATE INDEX "Template_occasion_language_status_idx" ON "Template"("occasion", "language", "status");
CREATE UNIQUE INDEX "Invitation_shareId_key" ON "Invitation"("shareId");
CREATE INDEX "Invitation_shareId_idx" ON "Invitation"("shareId");
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
