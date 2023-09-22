-- CreateTable
CREATE TABLE "UserCompletionFeedback" (
    "userId" TEXT NOT NULL,
    "completionId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "vendor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCompletionFeedback_pkey" PRIMARY KEY ("userId","completionId")
);
