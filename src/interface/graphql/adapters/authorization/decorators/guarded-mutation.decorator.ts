import { applyDecorators } from '@nestjs/common'
import { Mutation, MutationOptions } from '@nestjs/graphql'
import { Class } from 'type-fest'

import { Action } from '@adapters/policy/types/action.type'

import { GuardedGraphQLRequest } from './guarded-graphql-request.decorator'

export function GuardedMutation(
  GraphQLObject: Class<any>,
  actions: Action[] | Action,
  mutationOptions: MutationOptions,
) {
  return applyDecorators(
    GuardedGraphQLRequest(actions),
    Mutation(() => GraphQLObject, mutationOptions),
  )
}
