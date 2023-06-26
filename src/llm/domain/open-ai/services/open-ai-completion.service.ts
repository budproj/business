import { Injectable } from '@nestjs/common'
import { ActionType, OpenAiCompletion, TargetEntity } from '@prisma/client'
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai'

import { Author } from 'src/llm/shared/utilities/types'

import { HashProvider } from '../../../shared/hash-provider/models/hash-provider'
import genarateId from '../../../shared/utilities/generate-id'
import { GenerateOpenAiCompletionDTO } from '../dtos/create-key-result-completion.dto'
import { OpenAICompletionRepository } from '../repositories/open-ai-completion-repositorie'

const { OPENAI_API_KEY } = process.env

interface OpenAICompletionRequest {
  referenceId: string
  entity: TargetEntity
  prompt: CreateChatCompletionRequest
  input: Record<string, unknown>
  author: Author
}

const openai = new OpenAIApi(
  new Configuration({
    apiKey: OPENAI_API_KEY,
  }),
)

const action = ActionType.Summarize

@Injectable()
class OpenAICompletionService {
  constructor(
    private readonly repository: OpenAICompletionRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  public async complete({
    referenceId,
    entity,
    prompt,
    input,
    author,
  }: OpenAICompletionRequest): Promise<OpenAiCompletion> {
    const { companyId: requesterCompanyId, id: requesterUserId, teamId: requesterTeamId } = author

    const hashedInput = await this.hashProvider.generateHash(input)
    const id = genarateId(action, entity, hashedInput)

    const completion = await this.repository.findCompletionById(id)

    if (completion) {
      return completion
    }

    const openAiCompletion = await this.repository.createCompletion({
      id,
      action,
      input: input as unknown as GenerateOpenAiCompletionDTO['input'],
      status: 'PENDING',
      referenceId,
      requesterUserId,
      requesterTeamId,
      requesterCompanyId,
      entity,
      model: prompt.model,
      messages: prompt.messages as unknown as GenerateOpenAiCompletionDTO['messages'],
      request: prompt as unknown as GenerateOpenAiCompletionDTO['request'],
      requestedAt: new Date(),
    })

    try {
      const { data: response } = await openai.createChatCompletion(prompt)

      const duration = Date.now() - openAiCompletion.requestedAt.getTime()

      const {
        usage: { completion_tokens, prompt_tokens, total_tokens },
        choices,
      } = response
      const {
        message: { content },
      } = choices[0]

      return await this.repository.updateCompletion(id, {
        status: 'COMPLETED',
        consumedTokens: completion_tokens,
        duration,
        producedTokens: prompt_tokens,
        totalTokens: total_tokens,
        respondedAt: new Date(),
        output: content,
        response: response as unknown as OpenAiCompletion['response'],
      })
    } catch {
      await this.repository.updateCompletion(id, { status: 'FAILED' })
    }
  }
}

export default OpenAICompletionService
