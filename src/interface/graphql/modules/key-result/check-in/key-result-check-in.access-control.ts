import { AccessControl } from '@adapters/authorization/interfaces/access-control.interface'
import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

export class KeyResultCheckInAccessControl implements AccessControl<KeyResultCheckIn> {
  public async canCreate(user: UserWithContext, data: Partial<KeyResultCheckIn>): Promise<boolean> {
    console.log(user, data)
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
