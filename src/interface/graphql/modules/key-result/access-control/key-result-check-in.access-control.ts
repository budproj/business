import { Injectable } from '@nestjs/common'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { KeyResultBaseAccessControl } from '@interface/graphql/modules/key-result/access-control/base.access-control'

@Injectable()
export class KeyResultCheckInAccessControl extends KeyResultBaseAccessControl {
  protected readonly resource = Resource.KEY_RESULT_CHECK_IN

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  public async canCreate(user: UserWithContext, keyResultID: string): Promise<boolean> {
    return this.canCreateInKeyResult(user, keyResultID)
  }

  public async canRead(_user: UserWithContext, _id: string): Promise<boolean> {
    return true
  }

  public async canUpdate(_user: UserWithContext, _id: string): Promise<boolean> {
    return false
  }

  public async canDelete(_user: UserWithContext, _id: string): Promise<boolean> {
    return false
  }
}
