import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'
import { CoreProvider } from '@core/core.provider'
import { GraphQLGuard } from '@interface/graphql/adapters/authorization/guards/graphql.guard'

@Injectable()
export class KeyResultCheckInGraphQLGuard extends GraphQLGuard {
  constructor(
    protected readonly reflector: Reflector,
    private readonly core: CoreProvider,
    config: GraphQLConfigProvider,
  ) {
    super(reflector, config)
  }

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const graphqlExecutionContext = this.getGraphQLExecutionContext(executionContext)
    const request = this.getGraphQLRequestFromContext(graphqlExecutionContext)
    const resolverRequiredActions = this.getResolverRequiredActions(graphqlExecutionContext)

    console.log(request.user, resolverRequiredActions)

    return false
  }
}
