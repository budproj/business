import { Module } from '@nestjs/common'

import { OpenAICompletionRepository } from 'src/llm/domain/open-ai/repositories/open-ai-completion-repositorie'
import { UserFeedbackRepository } from 'src/llm/domain/user-feedback/repositories/user-feedback-repository'

import { PrismaService } from './prisma.service'
import { PrismaOpenAiCompletionRepository } from './prisma/repositories/prisma-open-ai-completion-repositorie'
import { PrismaUserFeedbackRepository } from './prisma/repositories/prisma-user-feedback-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: OpenAICompletionRepository,
      useClass: PrismaOpenAiCompletionRepository,
    },
    {
      provide: UserFeedbackRepository,
      useClass: PrismaUserFeedbackRepository,
    },
  ],
  exports: [OpenAICompletionRepository, UserFeedbackRepository],
})
export class DatabaseModule {}
