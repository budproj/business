import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Action } from '@adapters/policy/types/action.type'
import { Permission } from '@adapters/policy/types/permission.type'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'
import { CoreProvider } from '@core/core.provider'
import { User } from '@core/modules/user/user.orm-entity'
import { EntityGraphQLGuard } from '@interface/graphql/adapters/authorization/guards/entity.guard'

@Injectable()
export class KeyResultCheckInGraphQLGuard extends EntityGraphQLGuard {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly core: CoreProvider,
    config: GraphQLConfigProvider,
  ) {
    super(reflector, core, config)
  }

  protected async getRequiredPermissionsForUserAndActions(
    user: User,
    actions: Action[],
  ): Promise<Permission[]> {
    console.log(user, actions)

    return []
  }
}
