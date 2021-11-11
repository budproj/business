import { Injectable } from '@nestjs/common'

import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { KeyResultBaseAccessControl } from '@interface/graphql/modules/key-result/access-control/base.access-control'

type RelatedEntities = {
  keyResultCheckIn: KeyResultCheckIn
  keyResult: KeyResult
  teams: Team[]
}

@Injectable()
export class KeyResultCheckInAccessControl extends KeyResultBaseAccessControl {
  protected readonly resource = Resource.KEY_RESULT_CHECK_IN

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  static isCheckInAuthor(keyResultCheckIn: KeyResultCheckIn, user: UserWithContext): boolean {
    return keyResultCheckIn.userId === user.id
  }

  protected async resolveContextScopes(
    user: UserWithContext,
    keyResultID: string,
  ): Promise<AccessControlScopes> {
    return this.resolveKeyResultContext(user, keyResultID)
  }

  protected async resolveEntityScopes(
    user: UserWithContext,
    keyResultCheckInID: string,
  ): Promise<AccessControlScopes> {
    const { keyResult, teams } = await this.getRelatedEntities(keyResultCheckInID)

    const isOwner = await this.isKeyResultOwner(keyResult, user)
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isKeyResultCompanyMember(keyResult, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner,
    }
  }

  private async getRelatedEntities(keyResultCheckInID: string): Promise<RelatedEntities> {
    const keyResultCheckIn = await this.core.dispatchCommand<KeyResultCheckIn>(
      'get-key-result-check-in',
      { id: keyResultCheckInID },
    )
    const keyResult = await this.core.dispatchCommand<KeyResult>('get-key-result', {
      id: keyResultCheckIn.keyResultId,
    })
    const teams = await this.getKeyResultTeamTree(keyResult)

    return {
      keyResultCheckIn,
      keyResult,
      teams,
    }
  }
}
