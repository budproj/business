-- CreateTable
CREATE TABLE "Task" (
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "availableSubtasks" TEXT[],
    "completedSubtasks" TEXT[],

    CONSTRAINT "Task_pkey" PRIMARY KEY ("companyId","userId","teamId","weekId","templateId")
);

-- CreateIndex
CREATE INDEX "Task_companyId_userId_teamId_weekId_templateId_idx" ON "Task"("companyId", "userId", "teamId", "weekId", "templateId");
