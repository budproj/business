import { Body, Controller, Post } from '@nestjs/common'
import { CreateChatCompletionRequest } from 'openai'

import { Stopwatch } from '@lib/logger/pino.decorator'
import OpenAICompletionService from 'src/llm/domain/open-ai/services/open-ai-completion.service'
import { buildMessages } from 'src/llm/shared/utilities/summarize-key-result-prompt-builder'
import { Author, ModelName } from 'src/llm/shared/utilities/types'

import { CreateCompletionDTO } from '../DTOs/create-completion-body'

@Controller('llms')
export class LLMsController {
  constructor(private readonly openAiCompletionService: OpenAICompletionService) {}

  @Stopwatch()
  @Post('summarize/key-result')
  async create(@Body() body: CreateCompletionDTO) {
    const { input, referenceId } = body
    const author: Author = {
      companyId: '',
      id: '',
      teamId: '',
    }

    const entity = 'KeyResult'
    const company = 'Bud'

    const model: ModelName = 'gpt-3.5-turbo'
    const wrap = model.startsWith('gpt-3.5-turbo')

    const messages = buildMessages(company, input, wrap)
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
