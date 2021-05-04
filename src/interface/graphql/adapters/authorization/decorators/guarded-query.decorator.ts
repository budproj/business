import { applyDecorators } from '@nestjs/common'
import { Query, QueryOptions } from '@nestjs/graphql'
import { Class } from 'type-fest'

import { Action } from '@adapters/policy/types/action.type'

import { GuardedGraphQLRequest } from './guarded-graphql-request.decorator'

export function GuardedQuery(
  GraphQLObject: Class,
  actions: Action[] | Action,
  queryOptions: QueryOptions,
) {
  return applyDecorators(
    GuardedGraphQLRequest(actions),
    Query(() => GraphQLObject, queryOptions),
  )
}
