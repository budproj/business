import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Scope,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

import { AmplitudeProvider } from '@infrastructure/amplitude/amplitude.provider'

import { GraphQLRequest } from '../context/interfaces/request.interface'

@Injectable({ scope: Scope.REQUEST })
export class IdentifyGraphQLRequestToAmplitudeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdentifyGraphQLRequestToAmplitudeInterceptor.name)

  constructor(private readonly amplitude: AmplitudeProvider) {}

  public async intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: GraphQLRequest = graphqlContext.getContext().req

    await this.amplitude.identify(request.state)

    this.logger.debug({
      state: request.state,
      message: 'Identified user in Amplitude',
    })

    return next.handle()
  }
}
