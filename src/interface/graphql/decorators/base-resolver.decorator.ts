import { applyDecorators, UseInterceptors } from '@nestjs/common'

import { AttachRelayContextInterceptor } from '@interface/graphql/adapters/relay/interceptors/attach-context.interceptor'

import { InitializeGraphQLStateInterceptor } from '../interceptors/initialize-state.interceptor'

export function BaseResolver() {
  return applyDecorators(
    UseInterceptors(InitializeGraphQLStateInterceptor, AttachRelayContextInterceptor),
  )
}
