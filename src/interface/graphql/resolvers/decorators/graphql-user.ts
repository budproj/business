import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'

export const GraphQLUser = createParamDecorator<AuthorizationUser>(
  (_, executionContext: ExecutionContext) => {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request = graphqlContext.getContext().req

    return request.user
  },
)
