/*
  Warnings:

  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyId` on the `Task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Task_companyId_userId_teamId_weekId_templateId_idx";

-- AlterTable
ALTER TABLE "Task" DROP CONSTRAINT "Task_pkey",
DROP COLUMN "companyId",
ADD CONSTRAINT "Task_pkey" PRIMARY KEY ("userId", "teamId", "weekId", "templateId");

-- CreateIndex
CREATE INDEX "Task_userId_teamId_weekId_templateId_idx" ON "Task"("userId", "teamId", "weekId", "templateId");
