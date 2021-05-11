import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

import { GraphQLContext } from '@interface/graphql/adapters/context/interfaces/context.interface'
import { RelayGraphQLContextProvider } from '@interface/graphql/adapters/relay/providers/context.provider'

@Injectable()
export class AttachRelayContextInterceptor implements NestInterceptor {
  public async intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const rawContext = GqlExecutionContext.create(executionContext)
    const graphqlContext: GraphQLContext = rawContext.getContext()

    graphqlContext.relay = new RelayGraphQLContextProvider()

    return next.handle()
  }
}
