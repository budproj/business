import { UserWithContext } from "@adapters/context/interfaces/user.interface";
import { CoreEntity } from "@core/core.orm-entity";

export interface AccessControl<E extends CoreEntity> {
  canCreate(user: UserWithContext, data: Partial<E>): boolean | Promise<boolean>
  canRead(user: UserWithContext, entity: E): boolean | Promise<boolean>
  canUpdate(user: UserWithContext, entity: E): boolean | Promise<boolean>
  canDelete(user: UserWithContext, entity: E): boolean | Promise<boolean>
}