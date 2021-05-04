import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthorizationAdapter } from '@adapters/authorization/authorization.adapter'
import { GodBypass } from '@adapters/authorization/godmode/decorators/god-bypass.decorator'
import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { Action } from '@adapters/policy/types/action.type'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'

@Injectable()
export class GraphQLRequiredPoliciesGuard implements CanActivate {
  protected readonly godmode: GodmodeProvider
  private readonly logger = new Logger(GraphQLRequiredPoliciesGuard.name)
  private readonly authorization = new AuthorizationAdapter()

  constructor(
    private readonly reflector: Reflector,
    private readonly config: GraphQLConfigProvider,
  ) {
    this.godmode = new GodmodeProvider(this.config.godmode)
  }

  @GodBypass(true)
  public canActivate(executionContext: ExecutionContext) {
    const graphqlExecutionContext = GqlExecutionContext.create(executionContext)
    const request = graphqlExecutionContext.getContext().req

    const resolverRequiredActions = this.getResolverRequiredActions(graphqlExecutionContext)

    this.logger.debug({
      resolverRequiredActions,
      user: request.user,
      message: 'Checking if user is allowed in given route',
    })

    const hasRequiredPolicies = this.authorization.canUserExecuteActions(
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
