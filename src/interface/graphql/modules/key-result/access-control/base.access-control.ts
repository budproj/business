import { UserInputError } from 'apollo-server-errors'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'

export abstract class KeyResultBaseAccessControl extends AccessControl {
  protected async resolveKeyResultContext(
    user: UserWithContext,
    keyResultID: string,
  ): Promise<AccessControlScopes> {
    const keyResult = await this.core.dispatchCommand<KeyResult>('get-key-result', {
      id: keyResultID,
    })
    if (!keyResult) throw new UserInputError('We could not find a key-result for your request')

    const teams = await this.core.dispatchCommand<Team[]>('get-key-result-team-tree', keyResult)

    const isKeyResultOwner = this.isKeyResultOwner(keyResult, user)
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isKeyResultCompanyMember(keyResult, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isKeyResultOwner,
    }
  }

  protected async resolveTeamContext(
    user: UserWithContext,
    teamID: string,
  ): Promise<AccessControlScopes> {
    const teams = await this.core.dispatchCommand<Team[]>('get-team-tree', { id: teamID })

    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isCompanyMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isTeamLeader,
    }
  }

  protected async getKeyResultTeamTree(keyResult: KeyResult): Promise<Team[]> {
    return this.core.dispatchCommand<Team[]>('get-key-result-team-tree', keyResult)
  }

  protected isKeyResultOwner(keyResult: KeyResult, user: UserWithContext): boolean {
    return keyResult.ownerId === user.id
  }

  protected async isKeyResultCompanyMember(
    keyResult: KeyResult,
    user: UserWithContext,
  ): Promise<boolean> {
    const keyResultCompany = await this.core.dispatchCommand<Team>(
      'get-key-result-company',
      keyResult,
    )

    return this.isCompanyMember([keyResultCompany], user)
  }
}
