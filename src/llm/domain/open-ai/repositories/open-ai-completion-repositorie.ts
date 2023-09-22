import { OpenAiCompletion } from '@prisma/llm/generated'

import { GenerateOpenAiCompletionDTO } from '../dtos/create-key-result-completion.dto'

export abstract class OpenAICompletionRepository {
  abstract createCompletion(data: GenerateOpenAiCompletionDTO): Promise<OpenAiCompletion>
  abstract findCompletionById(id: string): Promise<OpenAiCompletion | undefined>
  abstract updateCompletion(
    completionId: OpenAiCompletion['id'],
    data: Partial<OpenAiCompletion>,
  ): Promise<OpenAiCompletion>
}
