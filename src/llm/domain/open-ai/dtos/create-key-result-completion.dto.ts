import { OpenAiCompletion } from '@prisma/llm/generated'

export type GenerateOpenAiCompletionDTO = Pick<
  OpenAiCompletion,
  | 'id'
  | 'referenceId'
  | 'requesterUserId'
  | 'requesterTeamId'
  | 'requesterCompanyId'
  | 'action'
  | 'entity'
  | 'model'
  | 'messages'
  | 'input'
  | 'request'
  | 'status'
  | 'estimatedPromptTokens'
  | 'estimatedCompletionTokens'
>
