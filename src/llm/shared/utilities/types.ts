import { OpenAiCompletion } from '@prisma/client';

export type ModelName = typeof MODEL_NAMES[number]

export const MODEL_NAMES = [
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-0613',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-16k-0301',
  'gpt-3.5-turbo-16k-0613',
]

export interface Author {
  id: string
  companyId: string
  teamId: string
}
