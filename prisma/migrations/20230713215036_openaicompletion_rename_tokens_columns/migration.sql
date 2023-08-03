CREATE TABLE "OpenAiCompletion_backup202307131907" AS SELECT * FROM "OpenAiCompletion";

ALTER TABLE "OpenAiCompletion"
  RENAME COLUMN "consumedTokens" TO "completionTokens";

ALTER TABLE "OpenAiCompletion"
  RENAME COLUMN "producedTokens" TO "promptTokens";

ALTER TABLE "OpenAiCompletion"
  ALTER COLUMN "messages" TYPE JSONB USING array_to_json(messages)::JSONB,
  ALTER COLUMN "messages" SET NOT NULL,
  ADD COLUMN "estimatedCompletionTokens" INTEGER,
  ADD COLUMN "estimatedPromptTokens" INTEGER;
