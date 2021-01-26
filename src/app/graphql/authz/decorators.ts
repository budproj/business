import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { UserDTO } from 'src/domain/user/dto'

export const GraphQLUser = createParamDecorator<UserDTO>((_, rawContext: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(rawContext)
  const request = gqlContext.getContext().req

  return request.user
})
