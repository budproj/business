import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

  import { UserDTO } from 'domain/user/dto'

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions)

export const GraphQLUser = createParamDecorator<UserDTO>((_, rawContext: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(rawContext)
  const request = gqlContext.getContext().req

  return request.user
})
