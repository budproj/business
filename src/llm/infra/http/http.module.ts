import { Module } from '@nestjs/common'

import OpenAICompletionService from 'src/llm/domain/open-ai/services/open-ai-completion.service'
import { HashModule } from 'src/llm/shared/hash-provider/hash.module'

import { DatabaseModule } from '../database/database.module'

import { LLMsController } from './controllers/llm.controller'

@Module({
  imports: [DatabaseModule, HashModule],
  controllers: [LLMsController],
  providers: [OpenAICompletionService],
})
export class HttpModule {}
