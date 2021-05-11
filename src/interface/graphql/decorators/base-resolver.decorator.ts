import { applyDecorators, UseInterceptors } from '@nestjs/common'

import { InitializeGraphQLStateInterceptor } from '../interceptors/initialize-state.interceptor'

export function BaseResolver() {
  return applyDecorators(UseInterceptors(InitializeGraphQLStateInterceptor))
}
