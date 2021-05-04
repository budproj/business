import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'

import { GraphQLRequest } from '../../context/interfaces/request.interface'

export const AuthorizedRequestUser = createParamDecorator<AuthorizationUser>(
  (_, executionContext: ExecutionContext) => {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: GraphQLRequest = graphqlContext.getContext().req

    return request.state.user
  },
)
