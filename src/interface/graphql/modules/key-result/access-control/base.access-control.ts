import { UserInputError } from 'apollo-server-errors'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'

export abstract class KeyResultBaseAccessControl extends AccessControl {
  protected async resolveKeyResultContext(user: UserWithContext, keyResultID: string): Promise<AccessControlScopes> {
    const keyResult = await this.core.dispatchCommand<KeyResult>('get-key-result', {
      id: keyResultID,
    })
    if (!keyResult) throw new UserInputError('We could not find a key-result for your request')

    const teams = await this.getKeyResultTeamTree(keyResult)

    const isKeyResultOwner = await this.isKeyResultOwner(keyResult, user)
    const isTeamLeader = this.isTeamLeader(teams, user)
    const isCompanyMember = this.isTeamsMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isKeyResultOwner,
    }
  }

  protected async resolveTeamContext(user: UserWithContext, teamID: string): Promise<AccessControlScopes> {
    const teams = await this.teamProvider.getAscendantsByIds([teamID], {
      includeOriginTeams: true,
      rootsOnly: false,
    })

    const isTeamLeader = this.isTeamLeader(teams, user)
    const isCompanyMember = this.isTeamsMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isTeamLeader,
    }
  }

  protected async getKeyResultTeamTree(keyResult: KeyResult): Promise<Team[]> {
    return keyResult.teamId
      ? this.teamProvider.getAscendantsByIds([keyResult.teamId], {
          includeOriginTeams: true,
          rootsOnly: false,
        })
      : this.teamProvider.getAscendantsFromUser(keyResult.ownerId, {
          rootsOnly: false,
        })
  }

  protected async isKeyResultOwner(keyResult: KeyResult, user: UserWithContext): Promise<boolean> {
    const supportTeam = await this.core.dispatchCommand<KeyResult['supportTeamMembers']>(
      'get-key-result-support-team',
      keyResult.id,
    )
    const supportTeamIds = supportTeam.map((member) => member.id)

    const owners = [...supportTeamIds, keyResult.ownerId]

    return owners.includes(user.id)
  }

  protected async isKeyResultCompanyMember(keyResult: KeyResult, user: UserWithContext): Promise<boolean> {
    const teams = await this.getKeyResultTeamTree(keyResult)

    return this.isTeamsMember(teams, user)
  }
}
