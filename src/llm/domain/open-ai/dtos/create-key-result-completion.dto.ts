import { ActionType, OpenAiCompletionStatus, Prisma, TargetEntity } from '@prisma/client'

export interface GenerateOpenAiCompletionDTO {
  id: string
  referenceId: string
  requesterUserId: string
  requesterTeamId: string
  requesterCompanyId: string
  action: ActionType
  entity: TargetEntity
  model: string
  messages: Prisma.OpenAiCompletionCreatemessagesInput | Prisma.Enumerable<Prisma.InputJsonValue>
  input: Prisma.JsonNullValueInput | Prisma.InputJsonValue
  request: Prisma.JsonNullValueInput | Prisma.InputJsonValue
  status: OpenAiCompletionStatus
  requestedAt: Date | null
}
