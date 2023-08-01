import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import OpenAICompletionService from 'src/llm/domain/open-ai/services/open-ai-completion.service'
import UserFeedbackService from 'src/llm/domain/user-feedback/services/open-ai-completion.service'
import { HashModule } from 'src/llm/shared/hash-provider/hash.module'

import { DatabaseModule } from '../database/database.module'

import { AddHTTPContextToUserInterceptor } from './context/interceptors/add-http-context-to-user.interceptor'
import { LLMsController } from './controllers/llm.controller'

@Module({
  imports: [DatabaseModule, HashModule, CoreModule],
  controllers: [LLMsController],
  providers: [OpenAICompletionService, AddHTTPContextToUserInterceptor, UserFeedbackService],
})
export class HttpModule {}
