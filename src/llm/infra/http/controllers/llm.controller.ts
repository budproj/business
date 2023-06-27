import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateChatCompletionRequest } from 'openai'

import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Stopwatch } from '@lib/logger/pino.decorator'
import OpenAICompletionService from 'src/llm/domain/open-ai/services/open-ai-completion.service'
import { buildMessages } from 'src/llm/shared/utilities/summarize-key-result-prompt-builder'
import { Author, ModelName } from 'src/llm/shared/utilities/types'

import { CreateCompletionDTO } from '../DTOs/create-completion-body'
import { HTTPRequestUserWithContext } from '../context/decorators/http-request-user-with-context.decorator'
import { AddHTTPContextToUserInterceptor } from '../context/interceptors/add-http-context-to-user.interceptor'

@Controller('llms')
export class LLMsController {
  constructor(
    private readonly openAiCompletionService: OpenAICompletionService,
    private readonly core: CoreProvider,
  ) {}

  @Stopwatch()
  @UseInterceptors(AddHTTPContextToUserInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Post('summarize/key-result')
  async create(
    @Body() body: CreateCompletionDTO,
    @HTTPRequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const { input, referenceId } = body

    const keyResult = await this.core.keyResult.getFromID(referenceId)
    const [company] = await this.core.team.getUserCompanies(userWithContext)

    const author: Author = {
      companyId: company.id,
      id: userWithContext.id,
      teamId: keyResult.teamId,
    }

    const entity = 'KeyResult'

    const model: ModelName = 'gpt-3.5-turbo'
    const wrap = model.startsWith('gpt-3.5-turbo')

    const messages = buildMessages(company.name, input, wrap)
    const temperature: number = Number.parseFloat('0.5')

    const prompt: CreateChatCompletionRequest = {
      model,
      temperature,
      messages,
    }

    const { output } = await this.openAiCompletionService.complete({
      referenceId,
      entity,
      input: input as unknown as Record<string, unknown>,
      prompt,
      author,
    })

    return output
  }
}
