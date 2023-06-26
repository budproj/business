import { SummarizeKeyResultInput } from 'src/llm/shared/utilities/types'

export interface CreateCompletionDTO {
  input: SummarizeKeyResultInput
  referenceId: string
}
