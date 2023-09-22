/*
  Warnings:

  - The `response` column on the `OpenAiCompletion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OpenAiCompletion" ALTER COLUMN "output" SET DATA TYPE TEXT,
DROP COLUMN "response",
ADD COLUMN     "response" JSONB;
