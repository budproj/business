import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Policy } from '@adapters/authorization/types/policy.type'

@Injectable()
export class GraphQLRequiredPoliciesGuard implements CanActivate {
  private readonly logger = new Logger(GraphQLRequiredPoliciesGuard.name)
  private readonly authz = new AuthzAdapter()

  constructor(private readonly reflector: Reflector) {}

  public canActivate(executionContext: ExecutionContext) {
    const graphqlExecutionContext = GqlExecutionContext.create(executionContext)
    const request = graphqlExecutionContext.getContext().req

    const resolverRequiredPolicies = this.getResolverRequiredPolicies(graphqlExecutionContext)

    this.logger.debug({
      resolverRequiredPolicies,
      user: request.user,
      message: 'Checking if user is allowed in given route',
    })

    const hasRequiredPolicies = this.authz.userHasRequiredPolicies(
      request.user,
      resolverRequiredPolicies,
    )
    if (!hasRequiredPolicies)
      this.logger.error({
        resolverRequiredPolicies,
        token: request.user.token,
        message:
          'User is not allowed to use this resolver, since the user does not have all required policies',
      })

    return hasRequiredPolicies
  }

  private getResolverRequiredPolicies(graphqlExecutionContext: GqlExecutionContext) {
    const handler = graphqlExecutionContext.getHandler()
    const permissions = this.reflector.get<Policy[]>('requiredPolicies', handler)

    return permissions
  }
}
