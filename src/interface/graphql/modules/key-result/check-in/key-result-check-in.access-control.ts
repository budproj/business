import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/interfaces/access-control.interface'
import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class KeyResultCheckInAccessControl implements AccessControl<KeyResultCheckIn> {
  constructor(private readonly core: CorePortsProvider) {}

  public async canCreate(user: UserWithContext, data: Partial<KeyResultCheckIn>): Promise<boolean> {
    const keyResult = await this.core.getKeyResult.execute({ id: data.keyResultId })
    if (!keyResult) return false

    const isKeyResultOwner = await this.isKeyResultOwner(keyResult, user)
    console.log(isKeyResultOwner)

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

  private async isKeyResultOwner(keyResult: KeyResult, user: UserWithContext): Promise<boolean> {
    const owner = await this.core.getKeyResultOwner.execute(keyResult)

    return owner.id === user.id
  }
}
