import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthorizationAdapter } from '@adapters/authorization/authorization.adapter'
import { Action } from '@adapters/policy/types/action.type'

import { RequestWithUserToken } from '../interfaces/request-with-user-token'

export abstract class BaseAuthorizationGraphQLReflector {
  protected readonly authorization = new AuthorizationAdapter()

  constructor(protected readonly reflector: Reflector) {}

  protected getGraphQLExecutionContext(executionContext: ExecutionContext): GqlExecutionContext {
    return GqlExecutionContext.create(executionContext)
  }

  protected getGraphQLRequestFromContext(
    graphqlExecutionContext: GqlExecutionContext,
  ): RequestWithUserToken {
    return graphqlExecutionContext.getContext().req
  }

  protected getResolverRequiredActions(graphqlExecutionContext: GqlExecutionContext): Action[] {
    const handler = graphqlExecutionContext.getHandler()
    const permissions = this.reflector.get<Action[]>('requiredActions', handler)

    return permissions
  }
}
