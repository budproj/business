-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('Summarize');

-- CreateEnum
CREATE TYPE "TargetEntity" AS ENUM ('KeyResult');

-- CreateEnum
CREATE TYPE "OpenAiCompletionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "OpenAiCompletion" (
    "id" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "requesterUserId" TEXT NOT NULL,
    "requesterTeamId" TEXT NOT NULL,
    "requesterCompanyId" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "entity" "TargetEntity" NOT NULL,
    "model" TEXT NOT NULL,
    "messages" JSONB[],
    "input" JSONB NOT NULL,
    "request" JSONB NOT NULL,
    "status" "OpenAiCompletionStatus" NOT NULL,
    "requestedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "respondedAt" TIMESTAMP(3),
    "consumedTokens" INTEGER,
    "producedTokens" INTEGER,
    "totalTokens" INTEGER,
    "output" JSONB,
    "response" TEXT NOT NULL,

    CONSTRAINT "OpenAiCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpenAiCompletion_action_entity_requesterUserId_idx" ON "OpenAiCompletion"("action", "entity", "requesterUserId");
