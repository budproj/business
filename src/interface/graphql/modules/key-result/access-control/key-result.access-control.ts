import { Injectable } from '@nestjs/common'

import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
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
      return {
        isTeamLeader: false,
        isCompanyMember: false,
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
