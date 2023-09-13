export type userFromMCContext = {
  userId: string
  teamIds: string[]
}

export abstract class CoreDomainRepository {
  abstract findAllUsersAndTeams(): Promise<userFromMCContext[]>
}
