/*
  Warnings:

  - You are about to drop the column `duration` on the `OpenAiCompletion` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "OpenAiCompletion_action_entity_requesterUserId_idx";

-- AlterTable
ALTER TABLE "OpenAiCompletion" DROP COLUMN "duration";

-- CreateIndex
CREATE INDEX "OpenAiCompletion_action_entity_referenceId_respondedAt_idx" ON "OpenAiCompletion"("action", "entity", "referenceId", "respondedAt" DESC);
