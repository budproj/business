import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { Class } from 'type-fest'

import { GraphQLRequiredPoliciesGuard } from '../guards/required-policies.guard'
import { GraphQLTokenGuard } from '../guards/token.guard'
import { NourishUserDataInterceptor } from '../interceptors/nourish-user-data.interceptor'

export function GuardedResolver(GraphQLObject: Class) {
  return applyDecorators(
    UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard),
    UseInterceptors(NourishUserDataInterceptor),
    Resolver(() => GraphQLObject),
  )
}
