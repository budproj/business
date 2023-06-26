import { Module } from '@nestjs/common'

import { OpenAICompletionRepository } from 'src/llm/domain/open-ai/repositories/open-ai-completion-repositorie'

import { PrismaService } from './prisma.service'
import { PrismaOpenAiCompletionRepository } from './prisma/repositories/prisma-open-ai-completion-repositorie'

@Module({
  providers: [
    PrismaService,
    {
      provide: OpenAICompletionRepository,
      useClass: PrismaOpenAiCompletionRepository,
    },
  ],
  exports: [OpenAICompletionRepository],
})
export class DatabaseModule {}
