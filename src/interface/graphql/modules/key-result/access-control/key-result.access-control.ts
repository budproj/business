import { Injectable } from '@nestjs/common'

import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { KeyResultBaseAccessControl } from '@interface/graphql/modules/key-result/access-control/base.access-control'

@Injectable()
export class KeyResultAccessControl extends KeyResultBaseAccessControl {
  protected readonly resource = Resource.KEY_RESULT

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  protected async resolveContextScopes(
    user: UserWithContext,
    teamID: string,
    ownerId: string,
  ): Promise<AccessControlScopes> {
    if (!teamID) {
      const userCompanies = await this.core.dispatchCommand<Team[]>('get-user-team-tree', {
        id: ownerId,
      })

      const isCompanyMember = await this.isCompanyMember(userCompanies, user)

      return {
        isTeamLeader: false,
        isCompanyMember,
        isOwner: ownerId === user.id,
      }
    }

    return this.resolveTeamContext(user, teamID)
  }

  protected async resolveEntityScopes(
    user: UserWithContext,
    keyResultID: string,
  ): Promise<AccessControlScopes> {
    return this.resolveKeyResultContext(user, keyResultID)
  }
}
