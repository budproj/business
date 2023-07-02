import * as assert from 'assert';
import { setTimeout } from 'timers/promises';
import { Injectable, Logger } from '@nestjs/common';
import { ActionType, OpenAiCompletion, OpenAiCompletionStatus, TargetEntity } from '@prisma/client';
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai'
import { differenceInSeconds } from 'date-fns';

import { Author } from 'src/llm/shared/utilities/types';

import { HashProvider } from '../../../shared/hash-provider/models/hash-provider'
import generateId from '../../../shared/utilities/generate-id'
import { GenerateOpenAiCompletionDTO } from '../dtos/create-key-result-completion.dto'
import { OpenAICompletionRepository } from '../repositories/open-ai-completion-repositorie'

/**
 * @deprecated TODO: move this to a config file to avoid depending on global variables
 */
const { LLM_OPENAI_API_KEY } = process.env
assert(LLM_OPENAI_API_KEY, 'LLM_OPENAI_API_KEY is required');

interface OpenAICompletionRequest<T extends {}> {
  referenceId: string
  action: ActionType
  entity: TargetEntity
  prompt: CreateChatCompletionRequest
  input: T
  author: Author
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

  public async complete<T extends {}>(request: OpenAICompletionRequest<T>, remainingAttempts = 1): Promise<OpenAiCompletion> {

    if (remainingAttempts <= 0) {
      throw new Error('Could not complete request, maximum attempts reached')
    }

    const {
      referenceId,
      action,
      entity,
      prompt,
      input,
      author,
    } = request

    const hashedInput = await this.hashProvider.generateHash(input)
    const id = generateId(action, entity, hashedInput)

    const completion = await this.repository.findCompletionById(id)

    if (completion) {
      if (completion.status === OpenAiCompletionStatus.COMPLETED) {
        return completion
      }

      if (completion.status === OpenAiCompletionStatus.PENDING) {
        if (differenceInSeconds(new Date(), completion.createdAt) < 60) {
          // Completion is pending and was created less than 60 seconds ago; wait until it completes

          if (remainingAttempts <= 1) {
            this.logger.error(`Completion for ${id} is still pending, but maximum attempts reached. Returning pending completion`)
            return completion
          }

          // TODO: handle sleeping in a better way that does not hang the request for 15 seconds
          await setTimeout(15 * 1000);
          return await this.complete(request, remainingAttempts - 1)
        }
      }

      // completion.status === FAILED -> no need to insert, only retry
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
      const [{
        message: { content },
      }] = choices

      return await this.repository.updateCompletion(id, {
        status: OpenAiCompletionStatus.COMPLETED,
        consumedTokens: completion_tokens,
        producedTokens: prompt_tokens,
        totalTokens: total_tokens,
        requestedAt,
        respondedAt,
        output: content,
        response: response as unknown as OpenAiCompletion['response'],
      })
    } catch (err) {
      const response = err.response ?? null;

      if (response) {
        this.logger.error(`Failed to generate completion for ${id} due to "${err.message}": %o`, response)

        return await this.repository.updateCompletion(id, {
          status: OpenAiCompletionStatus.FAILED,
          requestedAt,
          response: response,
        })
      }

      this.logger.error(`Failed to generate completion for ${id} due to %o`, err)

      return await this.repository.updateCompletion(id, {
        status: OpenAiCompletionStatus.FAILED,
        requestedAt,
      })
    }
  }
}

export default OpenAICompletionService
