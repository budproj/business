import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'

import { User as UserEntity } from 'domain/user-aggregate/user/entities'

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions)

export const User = createParamDecorator<UserEntity>((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  return request._budUser
})
