import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityAdapter } from '@adapters/activity/activity.adapter'
import { ActivityConstructor } from '@adapters/activity/types/activity-constructor.type'
import { AmplitudeProvider } from '@infrastructure/amplitude/amplitude.provider'
import { NotificationProvider } from '@infrastructure/notification/notification.provider'
import { GraphQLContext } from '@interface/graphql/adapters/context/interfaces/context.interface'

import { GraphQLRequestState } from '../context/interfaces/request-state.interface'

@Injectable()
export class DispatchResponseToActivityInterceptor<T> implements NestInterceptor<T> {
  private readonly activityAdapter: ActivityAdapter

  constructor(
    private readonly reflector: Reflector,
    amplitudeProvider: AmplitudeProvider,
    notificationProvider: NotificationProvider,
  ) {
    this.activityAdapter = new ActivityAdapter({
      amplitude: amplitudeProvider,
      notification: notificationProvider,
    })
  }

  static getContext(executionContext: ExecutionContext): GraphQLContext {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    return graphqlContext.getContext()
  }

  static getRequestState(executionContext: ExecutionContext): GraphQLRequestState {
    return DispatchResponseToActivityInterceptor.getContext(executionContext).req.state
  }

  static getContextActivity(executionContext: ExecutionContext): Activity {
    return DispatchResponseToActivityInterceptor.getContext(executionContext).activity
  }

  public intercept(executionContext: ExecutionContext, next: CallHandler): Observable<T> {
    const context = DispatchResponseToActivityInterceptor.getContext(executionContext)

    context.activity = this.buildActivity({} as any, executionContext)

    return next.handle().pipe(map((data) => this.handleResult(data, executionContext)))
  }

  private buildActivity(data: T, executionContext: ExecutionContext): Activity<T> {
    const state = DispatchResponseToActivityInterceptor.getRequestState(executionContext)
    const Activity = this.reflector.get<ActivityConstructor<T>>(
      'activity',
      executionContext.getHandler(),
    )

    return new Activity(data, state)
  }

  private handleResult(data: T, executionContext: ExecutionContext): T {
    const activity = DispatchResponseToActivityInterceptor.getContextActivity(executionContext)
    activity.refreshData(data)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.activityAdapter.dispatch(activity)

    return data
  }
}
