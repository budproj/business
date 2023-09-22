import { OpenAiCompletion } from '.prisma/client'

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
