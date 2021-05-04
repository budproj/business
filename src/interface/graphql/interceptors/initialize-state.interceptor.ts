import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

import { GraphQLRequest } from '../adapters/context/interfaces/request.interface'

const INITIAL_STATE = {}

@Injectable()
export class InitializeGraphQLStateInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InitializeGraphQLStateInterceptor.name)

  public async intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: GraphQLRequest = graphqlContext.getContext().req

    request.state = INITIAL_STATE

    this.logger.debug({
      initialState: request.state,
      message: 'Initialized request state',
    })

    return next.handle()
  }
}
