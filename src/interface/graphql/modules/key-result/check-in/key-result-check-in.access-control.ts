import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/interfaces/access-control.interface'
import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

@Injectable()
export class KeyResultCheckInAccessControl implements AccessControl<KeyResultCheckIn> {
  constructor(private readonly core: CoreProvider) {}

  public async canCreate(user: UserWithContext, data: Partial<KeyResultCheckIn>): Promise<boolean> {
    console.log(user, data, this.core)
    return false
  }

  public async canRead(
    _user: UserWithContext,
    _indexes: Partial<KeyResultCheckIn>,
  ): Promise<boolean> {
    return false
  }

  public async canUpdate(
    _user: UserWithContext,
    _indexes: Partial<KeyResultCheckIn>,
  ): Promise<boolean> {
    return false
  }

  public async canDelete(
    _user: UserWithContext,
    _indexes: Partial<KeyResultCheckIn>,
  ): Promise<boolean> {
    return false
  }
}
