import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { GraphQLContext } from '@interface/graphql/adapters/context/interfaces/context.interface'
import { RelayGraphQLConnectionProvider } from '@interface/graphql/adapters/relay/providers/connection.provider'

export const RelayConnection = createParamDecorator<RelayGraphQLConnectionProvider>(
  (_, executionContext: ExecutionContext): RelayGraphQLConnectionProvider => {
    const rawContext = GqlExecutionContext.create(executionContext)
    const graphqlContext: GraphQLContext = rawContext.getContext()

    return graphqlContext.relay.connection
  },
)
