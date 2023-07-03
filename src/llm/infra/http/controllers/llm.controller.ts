import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateChatCompletionRequest } from 'openai'
import { ActionType, TargetEntity } from '@prisma/client';

import { Stopwatch } from '@lib/logger/pino.decorator'
import OpenAICompletionService from 'src/llm/domain/open-ai/services/open-ai-completion.service'
import { buildMessages } from 'src/llm/shared/utilities/summarize-key-result-prompt-builder'
import { Author } from 'src/llm/shared/utilities/types';
import { SummarizeKeyResultInput } from 'src/llm/shared/utilities/summarize-key-result.types';

import { CreateCompletionDTO } from '../DTOs/create-completion-body';

interface CreateCompletionResponse {
  summary: string
  model: string
}

@Controller('llms')
export class LLMsController {
  constructor(
    private readonly openAiCompletionService: OpenAICompletionService,
  ) {}

  @Stopwatch()
  @UseGuards(AuthGuard('jwt'))
  @Post('summarize/key-result')
  async summarizeKeyResult(
    @Body() body: CreateCompletionDTO<SummarizeKeyResultInput>,
  ): Promise<CreateCompletionResponse> {
    const { input, referenceId } = body

    const author: Author = {
      companyId: body.author.companyId,
      id: body.author.id,
      teamId: body.author.teamId,
    }

    const messages = buildMessages(input, true, body.locale ?? 'pt-BR')

    const prompt: CreateChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      messages,
    }

    const { output, model } = await this.openAiCompletionService.complete({
      referenceId,
      action: ActionType.Summarize,
      entity: TargetEntity.KeyResult,
      input,
      prompt,
      author,
    }, 3)

    return { summary: output, model }
  }
}
