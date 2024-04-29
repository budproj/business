import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { UserWithContext } from '@adapters/state/interfaces/user.interface'

import { HTTPRequest } from '../types'

export const HTTPRequestUserWithContext = createParamDecorator<UserWithContext>(
  (_, executionContext: ExecutionContext) => {
    const request = executionContext.switchToHttp().getRequest<HTTPRequest>()
    return request.userWithContext
  },
)
