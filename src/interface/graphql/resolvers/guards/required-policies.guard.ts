import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Action } from '@adapters/authorization/types/action.type'

@Injectable()
export class GraphQLRequiredPoliciesGuard implements CanActivate {
  private readonly logger = new Logger(GraphQLRequiredPoliciesGuard.name)
  private readonly authz = new AuthzAdapter()

  constructor(private readonly reflector: Reflector) {}

  public canActivate(executionContext: ExecutionContext) {
    const graphqlExecutionContext = GqlExecutionContext.create(executionContext)
    const request = graphqlExecutionContext.getContext().req

    const resolverRequiredActions = this.getResolverRequiredActions(graphqlExecutionContext)

    this.logger.debug({
      resolverRequiredActions,
      user: request.user,
      message: 'Checking if user is allowed in given route',
    })

    const hasRequiredPolicies = this.authz.canUserExecuteActions(
      request.user,
      resolverRequiredActions,
    )
    if (!hasRequiredPolicies)
      this.logger.error({
        resolverRequiredActions,
        token: request.user.token,
        message:
          'User is not allowed to use this resolver, since the user does not have all required policies',
      })

    return hasRequiredPolicies
  }

  private getResolverRequiredActions(graphqlExecutionContext: GqlExecutionContext) {
    const handler = graphqlExecutionContext.getHandler()
    const permissions = this.reflector.get<Action[]>('requiredActions', handler)

    return permissions
  }
}
