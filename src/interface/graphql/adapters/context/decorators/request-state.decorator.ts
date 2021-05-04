import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { GraphQLRequestState } from '../interfaces/request-state.interface'
import { GraphQLRequest } from '../interfaces/request.interface'

export const RequestState = createParamDecorator<GraphQLRequestState>(
  (_, executionContext: ExecutionContext) => {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: GraphQLRequest = graphqlContext.getContext().req

    return request.state
  },
)
