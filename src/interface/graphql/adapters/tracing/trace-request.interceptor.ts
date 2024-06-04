import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-errors'
import { Observable } from 'rxjs'

import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { InvalidSessionIDException } from '@adapters/tracing/exceptions/invalid-session-id.exception'
import { TracingInterface } from '@adapters/tracing/tracing.interface'
import { TracingProvider } from '@adapters/tracing/tracing.provider'

import { GraphQLRequest } from '../context/interfaces/request.interface'

@Injectable()
export class TraceGraphQLRequestInterceptor implements NestInterceptor {
  protected readonly godmode: GodmodeProvider
  private readonly tracing = new TracingProvider('http-request')

  public intercept(executionContext: ExecutionContext, next: CallHandler): Observable<any> {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: GraphQLRequest = graphqlContext.getContext().req

    const tracingData = this.getTracingData(request)
    request.tracing = tracingData

    return next.handle()
  }

  private getTracingData(request: GraphQLRequest): TracingInterface {
    try {
      this.tracing.refreshData(request.headers)
    } catch (error: unknown) {
      if (error instanceof InvalidSessionIDException) throw new UserInputError(error.message)
    }

    return this.tracing.data
  }
}
