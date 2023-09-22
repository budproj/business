/* eslint-disable no-warning-comments */
import { Body, Controller, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Stopwatch } from '@lib/logger/pino.decorator'
import { ActionType, TargetEntity } from '@prisma/llm/generated'
import OpenAICompletionService, {
  CompletionRequestPrompt,
} from 'src/llm/domain/open-ai/services/open-ai-completion.service'
import UserFeedbackService from 'src/llm/domain/user-feedback/services/open-ai-completion.service'
import summarizeKeyResultPrompt from 'src/llm/shared/utilities/summarize-key-result-prompt-builder'
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
    const { input, referenceId, locale = 'pt-br', suggestions = false } = body

    const author: Author = {
      companyId: body.author.companyId,
      id: body.author.id,
      teamId: body.author.teamId,
    }

    // TODO: evaluate whether we should set wrap=true for gpt-3.5-turbo
    const { promptVersion, messages } = summarizeKeyResultPrompt(input, {
      locale,
      suggestions,
      activityThresholdInWeeks: 2,
    })

    const draftPrompt: CompletionRequestPrompt = {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      messages,
    }

    // Check this document for an explanation of the formula:
    // https://www.notion.so/budops/Spotlight-P-s-release-d57d9e57f42a49e18633018186e9d023?pvs=4#f5b30c2249bb4135af3fd257b648e28f
    const promptTokens = this.openAiCompletionService.estimatePromptTokens(draftPrompt).count
    const completionTokens = promptTokens ? -191 + 59.6 * Math.log(promptTokens) : null
    const exceedsContextWindowSize = promptTokens && promptTokens + completionTokens > 4096

    // Try to estimate the total number of tokens that will be used by the completion
    // If it exceeds the 4k tokens context window, switch to gpt-3.5-turbo-16k
    const prompt: CompletionRequestPrompt = {
      ...draftPrompt,
      model: exceedsContextWindowSize ? 'gpt-3.5-turbo-16k' : draftPrompt.model,
    }

    const { output, model, respondedAt, id } = await this.openAiCompletionService.complete(
      {
        referenceId,
        action: ActionType.Summarize,
        entity: TargetEntity.KeyResult,
        input,
        prompt,
        promptVersion,
        author,
        estimates: {
          promptTokens,
          completionTokens,
        },
      },
      3,
    )

    return { summary: output, model, respondedAt, id }
  }

  @Stopwatch()
  @UseGuards(AuthGuard('jwt'))
  @Post('feedback')
  async saveFeedback(@Body() body: CreateUserFeedback): Promise<CreateUserFeedback> {
    const { completionId, userId, value } = body

    if (value > 1 || value < -1) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
    }

    const userFeedback: CreateUserFeedback = {
      completionId,
      userId,
      value,
      vendor: 'OpenAI',
    }

    return this.userFeedbackService.upsert(userFeedback)
  }
}
