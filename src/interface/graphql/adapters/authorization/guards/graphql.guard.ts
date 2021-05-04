import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthorizationAdapter } from '@adapters/authorization/authorization.adapter'
import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { Action } from '@adapters/policy/types/action.type'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'

import { RequestWithUserToken } from '../interfaces/request-with-user-token'

export abstract class GraphQLGuard implements CanActivate {
  protected readonly godmode: GodmodeProvider
  protected readonly authorization = new AuthorizationAdapter()

  constructor(protected readonly reflector: Reflector, config: GraphQLConfigProvider) {
    this.godmode = new GodmodeProvider(config.godmode)
  }

  protected getGraphQLExecutionContext(executionContext: ExecutionContext): GqlExecutionContext {
    return GqlExecutionContext.create(executionContext)
  }

  protected getGraphQLRequestFromContext(
    graphqlExecutionContext: GqlExecutionContext,
  ): RequestWithUserToken {
    return graphqlExecutionContext.getContext().req
  }

  protected getResolverRequiredActions(graphqlExecutionContext: GqlExecutionContext) {
    const handler = graphqlExecutionContext.getHandler()
    const permissions = this.reflector.get<Action[]>('requiredActions', handler)

    return permissions
  }

  public abstract canActivate(executionContext: ExecutionContext): boolean | Promise<boolean>
}
