import { Injectable } from '@nestjs/common'

import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { KeyResultBaseAccessControl } from '@interface/graphql/modules/key-result/access-control/base.access-control'

@Injectable()
export class KeyResultCommentAccessControl extends KeyResultBaseAccessControl {
  protected readonly resource = Resource.KEY_RESULT_COMMENT

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
    _user: UserWithContext,
    _keyResultCommentID: string,
  ): Promise<AccessControlScopes> {
    return {
      isOwner: false,
      isTeamLeader: false,
      isCompanyMember: false,
    }
  }
}
