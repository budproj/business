import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { GodBypass } from '@adapters/authorization/godmode/decorators/god-bypass.decorator'
import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'

import { BaseAuthorizationGraphQLReflector } from '../reflectors/base.reflector'

@Injectable()
export class GraphQLRequiredPoliciesGraphQLGuard
  extends BaseAuthorizationGraphQLReflector
  implements CanActivate
{
  protected readonly godmode: GodmodeProvider
  private readonly logger = new Logger(GraphQLRequiredPoliciesGraphQLGuard.name)

  constructor(protected readonly reflector: Reflector, config: GraphQLConfigProvider) {
    super(reflector)

    this.godmode = new GodmodeProvider(config.godmode)
  }

  @GodBypass(true)
  public canActivate(executionContext: ExecutionContext) {
    const graphqlExecutionContext = this.getGraphQLExecutionContext(executionContext)
    const request = this.getGraphQLRequestFromContext(graphqlExecutionContext)
    const resolverRequiredActions = this.getResolverRequiredActions(graphqlExecutionContext)

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
}
