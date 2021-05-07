import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { UserWithContext } from '@adapters/context/interfaces/user.interface'

import { GraphQLRequest } from '../interfaces/request.interface'

export const RequestUserWithContext = createParamDecorator<UserWithContext>(
  (_, executionContext: ExecutionContext) => {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: GraphQLRequest = graphqlContext.getContext().req

    return request.state.user
  },
)
