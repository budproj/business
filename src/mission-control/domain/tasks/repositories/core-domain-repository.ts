import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'

export type userFromMCContext = {
  userId: string
  teamIds: string[]
}

export type findOutdatedKeyResultInput = {
  ownerId: string
  teamId: string
}

export type findKeyResultByConfidenceInput = {
  userId: string
  teamId: string
  confidence: ConfidenceTag
}
export abstract class CoreDomainRepository {
  abstract findAllUsersAndTeams(): Promise<userFromMCContext[]>
  abstract findOneKeyResultWithOutdatedCheckin({
    ownerId,
    teamId,
  }: findOutdatedKeyResultInput): Promise<any>
  abstract findOneKeyResultByConfidence({
    userId,
    teamId,
    confidence,
  }: findKeyResultByConfidenceInput): Promise<any>
}
