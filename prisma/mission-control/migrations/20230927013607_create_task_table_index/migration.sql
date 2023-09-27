-- CreateIndex
CREATE INDEX "Task_userId_teamId_weekId_templateId_idx" ON "Task"("userId", "teamId", "weekId", "templateId");
