export type userFromMCContextOutputTable = {
  user_id: string
  team_ids: string[]
}

export type keyResultFromMCContextOutputTable = {
  keyresult_id: string
}

export const CoreDomainDataMapper = {
  usersAndTeamsToDomain(input: userFromMCContextOutputTable[]) {
    return input.map((user) => ({
      userId: user.user_id,
      teamIds: user.team_ids,
    }))
  },

  keyResultsToDomain(input: keyResultFromMCContextOutputTable) {
    return input.keyresult_id
  },
}
