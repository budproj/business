import { Injectable } from '@nestjs/common'

import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { KeyResultBaseAccessControl } from '@interface/graphql/modules/key-result/access-control/base.access-control'

type RelatedEntities = {
  keyResultCheckMark: KeyResultCheckMark
  keyResult: KeyResult
  teams: Team[]
}

@Injectable()
export class KeyResultCheckMarkAccessControl extends KeyResultBaseAccessControl {
  protected readonly resource = Resource.KEY_RESULT_CHECK_MARK

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  protected async resolveContextScopes(
    user: UserWithContext,
    keyResultID: string,
  ): Promise<AccessControlScopes> {
    return this.resolveKeyResultContext(user, keyResultID)
  }

  protected async resolveEntityScopes(
    user: UserWithContext,
    keyResultCheckMarkID: string,
  ): Promise<AccessControlScopes> {
    const { keyResult, teams } = await this.getRelatedEntities(keyResultCheckMarkID)

    const isOwner = await this.isKeyResultOwner(keyResult, user)
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isKeyResultCompanyMember(keyResult, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner,
    }
  }

  private async getRelatedEntities(keyResultCheckMarkID: string): Promise<RelatedEntities> {
    const keyResultCheckMark = await this.core.dispatchCommand<KeyResultCheckMark>(
      'get-key-result-check-mark',
      { id: keyResultCheckMarkID },
    )
    const keyResult = await this.core.dispatchCommand<KeyResult>('get-key-result', {
      id: keyResultCheckMark.keyResultId,
    })
    const teams = await this.getKeyResultTeamTree(keyResult)

    return {
      keyResultCheckMark,
      keyResult,
      teams,
    }
  }
}
