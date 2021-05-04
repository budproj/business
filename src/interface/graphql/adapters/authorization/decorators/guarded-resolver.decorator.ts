import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { Class } from 'type-fest'

import { BaseResolver } from '@interface/graphql/decorators/base-resolver.decorator'

import { AddContextToUserInterceptor } from '../../context/interceptors/add-context-to-user'
import { GraphQLRequiredPoliciesGraphQLGuard } from '../guards/required-policies.guard'
import { TokenGraphQLGuard } from '../guards/token.guard'

export function GuardedResolver(GraphQLObject: Class) {
  return applyDecorators(
    BaseResolver(),
    UseGuards(TokenGraphQLGuard, GraphQLRequiredPoliciesGraphQLGuard),
    UseInterceptors(AddContextToUserInterceptor),
    Resolver(() => GraphQLObject),
  )
}
