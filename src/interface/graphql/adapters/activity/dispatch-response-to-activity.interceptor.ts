import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityAdapter } from '@adapters/activity/activity.adapter'
import { ActivityConstructor } from '@adapters/activity/types/activity-constructor.type'
import { AmplitudeProvider } from '@infrastructure/amplitude/amplitude.provider'

import { GraphQLRequestState } from '../context/interfaces/request-state.interface'
import { GraphQLRequest } from '../context/interfaces/request.interface'

@Injectable()
export class DispatchResponseToActivityInterceptor<T> implements NestInterceptor<T> {
  private readonly activityAdapter: ActivityAdapter

  constructor(private readonly reflector: Reflector, amplitudeProvider: AmplitudeProvider) {
    this.activityAdapter = new ActivityAdapter({
      amplitude: amplitudeProvider,
    })
  }

  public intercept(executionContext: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(map((data) => this.handleResult(data, executionContext)))
  }

  private getActivity(
    data: T,
    state: GraphQLRequestState,
    executionContext: ExecutionContext,
  ): Activity<T> {
    const Activity = this.reflector.get<ActivityConstructor<T>>(
      'activity',
      executionContext.getHandler(),
    )
    const activity = new Activity(data, state)

    return activity
  }

  private getRequestState(executionContext: ExecutionContext): GraphQLRequestState {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: GraphQLRequest = graphqlContext.getContext().req

    return request.state
  }

  private handleResult(data: T, executionContext: ExecutionContext): T {
    const state = this.getRequestState(executionContext)
    const activity = this.getActivity(data, state, executionContext)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.activityAdapter.dispatch(activity)

    return data
  }
}
