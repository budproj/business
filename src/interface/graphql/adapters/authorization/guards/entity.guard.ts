import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Action } from '@adapters/policy/types/action.type'
import { Permission } from '@adapters/policy/types/permission.type'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'
import { CoreProvider } from '@core/core.provider'
import { User } from '@core/modules/user/user.orm-entity'
import { GraphQLGuard } from '@interface/graphql/adapters/authorization/guards/graphql.guard'

export abstract class EntityGraphQLGuard extends GraphQLGuard {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly core: CoreProvider,
    config: GraphQLConfigProvider,
  ) {
    super(reflector, config)
  }

  // @GodBypass(true)
  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const graphqlExecutionContext = this.getGraphQLExecutionContext(executionContext)
    const request = this.getGraphQLRequestFromContext(graphqlExecutionContext)
    const resolverRequiredActions = this.getResolverRequiredActions(graphqlExecutionContext)
    const user = await this.core.user.getUserFromSubjectWithTeamRelation(request.user.token.sub)

    const requiredPermissions = await this.getRequiredPermissionsForUserAndActions(
      user,
      resolverRequiredActions,
    )
    const isAllowedToExecute = this.authorization.canUserExecutePermissions(
      request.user,
      requiredPermissions,
    )

    return isAllowedToExecute
  }

  protected abstract getRequiredPermissionsForUserAndActions(
    user: User,
    actions: Action[],
  ): Promise<Permission[]>
}
