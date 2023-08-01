import { Injectable, NotImplementedException } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class WorkspaceAccessControl extends AccessControl {
  protected readonly resource = Resource.WORKSPACE

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  protected async resolveContextScopes(_user: UserWithContext): Promise<AccessControlScopes> {
    return {
      isOwner: false,
      isTeamLeader: false,
      isCompanyMember: false,
    }
  }

  protected async resolveEntityScopes(
    _requestUser: UserWithContext,
    _userID: string,
  ): Promise<AccessControlScopes> {
    throw new NotImplementedException()
  }
}
