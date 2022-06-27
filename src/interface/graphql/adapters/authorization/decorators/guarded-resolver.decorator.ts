import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { Class } from 'type-fest'

import { AddContextToUserInterceptor } from '@interface/graphql/adapters/context/interceptors/add-context-to-user.interceptor'
import { TraceGraphQLRequestInterceptor } from '@interface/graphql/adapters/tracing/trace-request.interceptor'

import { GraphQLRequiredPoliciesGraphQLGuard } from '../guards/required-policies.guard'
import { TokenGraphQLGuard } from '../guards/token.guard'

export function GuardedResolver(GraphQLObject: Class<any>) {
  return applyDecorators(
    UseGuards(TokenGraphQLGuard, GraphQLRequiredPoliciesGraphQLGuard),
    UseInterceptors(AddContextToUserInterceptor, TraceGraphQLRequestInterceptor),
    Resolver(() => GraphQLObject),
  )
}
