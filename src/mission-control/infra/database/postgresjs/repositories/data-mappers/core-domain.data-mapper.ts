export type userFromMCContextOutputTable = {
  user_id: string
  team_ids: string[]
}

export const CoreDomainDataMapper = {
  usersAndTeamsToDomain(input: userFromMCContextOutputTable[]) {
    return input.map((user) => ({
      userId: user.user_id,
      teamIds: user.team_ids,
    }))
  },
}
