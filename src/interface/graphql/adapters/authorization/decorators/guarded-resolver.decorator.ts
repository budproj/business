import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { Class } from 'type-fest'

import { AddContextToUserInterceptor } from '@interface/graphql/adapters/context/interceptors/add-context-to-user.interceptor'
import { TraceGraphQLRequestInterceptor } from '@interface/graphql/adapters/tracing/trace-request.interceptor'
import { BaseResolver } from '@interface/graphql/decorators/base-resolver.decorator'

import { GraphQLRequiredPoliciesGraphQLGuard } from '../guards/required-policies.guard'
import { TokenGraphQLGuard } from '../guards/token.guard'

export function GuardedResolver(GraphQLObject: Class) {
  return applyDecorators(
    BaseResolver(),
    UseGuards(TokenGraphQLGuard, GraphQLRequiredPoliciesGraphQLGuard),
    UseInterceptors(AddContextToUserInterceptor, TraceGraphQLRequestInterceptor),
    Resolver(() => GraphQLObject),
  )
}
