import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { TracingInterface } from '@adapters/tracing/tracing.interface'
import { TracingProvider } from '@adapters/tracing/tracing.provider'

import { GraphQLRequest } from '../context/interfaces/request.interface'

@Injectable()
export class TraceGraphQLRequestInterceptor implements NestInterceptor {
  protected readonly godmode: GodmodeProvider
  private readonly logger = new Logger(TraceGraphQLRequestInterceptor.name)
  private readonly tracing = new TracingProvider('http-request')

  public intercept(executionContext: ExecutionContext, next: CallHandler): Observable<any> {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: GraphQLRequest = graphqlContext.getContext().req

    const tracingData = this.getTracingData(request)
    request.state.tracing = tracingData

    this.logger.debug({
      requestTracing: request.state.tracing,
      message: 'Attached tracing on current request',
    })

    return next.handle()
  }

  private getTracingData(request: GraphQLRequest): TracingInterface {
    this.tracing.refreshData(request.headers)

    return this.tracing.data
  }
}
