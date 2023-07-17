import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ActionType, TargetEntity } from '@prisma/client'
import { CreateChatCompletionRequest } from 'openai'

import { Stopwatch } from '@lib/logger/pino.decorator'
import OpenAICompletionService from 'src/llm/domain/open-ai/services/open-ai-completion.service'
import UserFeedbackService from 'src/llm/domain/user-feedback/services/open-ai-completion.service'
import { buildMessages } from 'src/llm/shared/utilities/summarize-key-result-prompt-builder'
import { SummarizeKeyResultInput } from 'src/llm/shared/utilities/summarize-key-result.types'
import { Author } from 'src/llm/shared/utilities/types'

import { CreateCompletionDTO } from '../DTOs/create-completion-body'
import { CreateUserFeedback } from '../DTOs/create-user-feedback-body'

interface CreateCompletionResponse {
  summary: string
  model: string
  respondedAt: Date
  id: string
}

@Controller('llms')
export class LLMsController {
  constructor(
    private readonly openAiCompletionService: OpenAICompletionService,
    private readonly userFeedbackService: UserFeedbackService,
  ) {}

  @Stopwatch()
  @UseGuards(AuthGuard('jwt'))
  @Post('summarize/key-result')
  async summarizeKeyResult(
    @Body() body: CreateCompletionDTO<SummarizeKeyResultInput>,
  ): Promise<CreateCompletionResponse> {
    const { input, referenceId, locale } = body

    const author: Author = {
      companyId: body.author.companyId,
      id: body.author.id,
      teamId: body.author.teamId,
    }

    const messages = buildMessages(input, true, locale ?? 'pt-BR')

    const prompt: CreateChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      messages,
    }

    const { output, model, respondedAt, id } = await this.openAiCompletionService.complete(
      {
        referenceId,
        action: ActionType.Summarize,
        entity: TargetEntity.KeyResult,
        input,
        prompt,
        author,
      },
      3,
    )

    return { summary: output, model, respondedAt, id }
  }

  @Stopwatch()
  @UseGuards(AuthGuard('jwt'))
  @Post('feedback')
  async createOrInsertUserFeedback(@Body() body: CreateUserFeedback): Promise<CreateUserFeedback> {
    const { completionId, userId, value } = body

    const userFeedback: CreateUserFeedback = {
      completionId,
      userId,
      value,
    }

    return this.userFeedbackService.upsert(userFeedback)
  }
}
