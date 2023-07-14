import * as assert from 'assert'
import { setTimeout } from 'timers/promises'

import tiktoken, { TiktokenModel } from '@dqbd/tiktoken'
import { Injectable, Logger } from '@nestjs/common'
import { ActionType, OpenAiCompletion, OpenAiCompletionStatus, TargetEntity } from '@prisma/client'
import { differenceInSeconds } from 'date-fns'
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai'

import { HashProvider } from '../../../shared/hash-provider/models/hash-provider'
import generateId from '../../../shared/utilities/generate-id'
import { Author, ModelName, TokenEstimate } from '../../../shared/utilities/types'
import { GenerateOpenAiCompletionDTO } from '../dtos/create-key-result-completion.dto'
import { OpenAICompletionRepository } from '../repositories/open-ai-completion-repositorie'

/**
 * @deprecated TODO: move this to a config file to avoid depending on global variables
 */
const { LLM_OPENAI_API_KEY } = process.env
assert(LLM_OPENAI_API_KEY, 'LLM_OPENAI_API_KEY is required')

export type CompletionRequestPrompt = Exclude<CreateChatCompletionRequest, 'model'> & {
  model: ModelName
}

export interface CompletionRequest<T> {
  referenceId: string
  action: ActionType
  entity: TargetEntity
  prompt: CompletionRequestPrompt
  promptVersion: string
  input: T
  author: Author
  estimates?: {
    promptTokens: number
    completionTokens: number
  }
}

@Injectable()
class OpenAICompletionService {
  private readonly logger = new Logger(OpenAICompletionService.name)

  private readonly openai: OpenAIApi

  constructor(
    private readonly repository: OpenAICompletionRepository,
    private readonly hashProvider: HashProvider,
  ) {
    this.openai = new OpenAIApi(
      new Configuration({
        // TODO: get from a config provider to avoid depending on global variables
        apiKey: LLM_OPENAI_API_KEY,
      }),
    )
  }

  public estimatePromptTokens({ model, messages }: CreateChatCompletionRequest): TokenEstimate {
    try {
      const encoding = tiktoken.encoding_for_model(model as TiktokenModel)

      const count = messages.reduce((sum, { content }) => sum + encoding.encode(content).length, 0)

      encoding.free()

      return { count }
    } catch (error) {
      this.logger.error(`Could not estimate prompt tokens for model ${model}`, error)
      return { error: error.message }
    }
  }

  public async complete<T>(
    request: CompletionRequest<T>,
    remainingAttempts = 1,
  ): Promise<OpenAiCompletion> {
    if (remainingAttempts <= 0) {
      throw new Error('Could not complete request, maximum attempts reached')
    }

    const { referenceId, action, entity, prompt, promptVersion, input, author, estimates } = request

    // As of 2023-07-14, the hash is calculated from the prompt instead of the input
    const hashedInput = await this.hashProvider.generateHash(prompt)
    const id = generateId({ action, entity, hashedInput, promptVersion })

    const completion = await this.repository.findCompletionById(id)

    if (completion) {
      if (completion.status === OpenAiCompletionStatus.COMPLETED) {
        return completion
      }

      if (
        completion.status === OpenAiCompletionStatus.PENDING &&
        differenceInSeconds(new Date(), completion.createdAt) < 60
      ) {
        // Completion is pending and was created less than 60 seconds ago; wait until it completes

        if (remainingAttempts <= 1) {
          this.logger.error(
            `Completion for ${id} is still pending, but maximum attempts reached. Returning pending completion`,
          )
          return completion
        }

        // TODO: handle sleeping in a better way that does not hang the request for 15 seconds
        await setTimeout(15 * 1000)
        return this.complete(request, remainingAttempts - 1)
      }

      // Completion.status === FAILED -> no need to insert, only retry
    } else {
      // Completion not found, create a new one
      await this.repository.createCompletion({
        id,
        action,
        input,
        status: OpenAiCompletionStatus.PENDING,
        referenceId,
        requesterUserId: author.id,
        requesterTeamId: author.teamId,
        requesterCompanyId: author.companyId,
        entity,
        model: prompt.model,
        messages: prompt.messages as unknown as GenerateOpenAiCompletionDTO['messages'],
        request: prompt as unknown as GenerateOpenAiCompletionDTO['request'],
        estimatedPromptTokens: estimates?.promptTokens ?? null,
        estimatedCompletionTokens: estimates?.completionTokens ?? null,
      })
    }

    const requestedAt = new Date()

    try {
      const { data: response } = await this.openai.createChatCompletion(prompt)
      const respondedAt = new Date()

      const {
        usage: { completion_tokens, prompt_tokens, total_tokens },
        choices,
      } = response
      const [
        {
          message: { content },
        },
      ] = choices

      return await this.repository.updateCompletion(id, {
        status: OpenAiCompletionStatus.COMPLETED,
        completionTokens: completion_tokens,
        promptTokens: prompt_tokens,
        totalTokens: total_tokens,
        requestedAt,
        respondedAt,
        output: content,
        response: response as unknown as OpenAiCompletion['response'],
      })
    } catch (error) {
      const response = error.response ?? null

      if (response) {
        this.logger.error(
          `Failed to generate completion for ${id} due to "${error.message}": %o`,
          response,
        )

        return this.repository.updateCompletion(id, {
          status: OpenAiCompletionStatus.FAILED,
          requestedAt,
          response,
        })
      }

      this.logger.error(`Failed to generate completion for ${id} due to %o`, error)

      return this.repository.updateCompletion(id, {
        status: OpenAiCompletionStatus.FAILED,
        requestedAt,
      })
    }
  }
}

export default OpenAICompletionService
