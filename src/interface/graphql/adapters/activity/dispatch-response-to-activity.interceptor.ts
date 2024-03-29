import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityAdapter } from '@adapters/activity/activity.adapter'
import { ActivityConstructor } from '@adapters/activity/types/activity-constructor.type'
import { NotificationProvider } from '@infrastructure/notification/notification.provider'
import { GraphQLContext } from '@interface/graphql/adapters/context/interfaces/context.interface'

import { GraphQLRequest } from '../context/interfaces/request.interface'

@Injectable({ scope: Scope.REQUEST })
export class DispatchResponseToActivityInterceptor<T> implements NestInterceptor<T> {
  private readonly activityAdapter: ActivityAdapter

  constructor(private readonly reflector: Reflector, notificationProvider: NotificationProvider) {
    this.activityAdapter = new ActivityAdapter({
      notification: notificationProvider,
    })
  }

  static graphqlExecutionContext(executionContext: ExecutionContext): GqlExecutionContext {
    return GqlExecutionContext.create(executionContext)
  }

  static getContext(executionContext: ExecutionContext): GraphQLContext {
    return DispatchResponseToActivityInterceptor.graphqlExecutionContext(
      executionContext,
    ).getContext()
  }

  static getRequestUserData(executionContext: ExecutionContext): Partial<GraphQLRequest> {
    const { req } = DispatchResponseToActivityInterceptor.getContext(executionContext)
    const { userWithContext, tracing } = req
    return { userWithContext, tracing }
  }

  static getContextActivity(executionContext: ExecutionContext): Activity {
    return DispatchResponseToActivityInterceptor.getContext(executionContext).activity
  }

  static getRequest(executionContext: ExecutionContext): Record<string, any> {
    return DispatchResponseToActivityInterceptor.graphqlExecutionContext(executionContext).getArgs()
      .data
  }

  public intercept(executionContext: ExecutionContext, next: CallHandler): Observable<Promise<T>> {
    const context = DispatchResponseToActivityInterceptor.getContext(executionContext)

    context.activity = this.buildActivity({} as any, executionContext)

    return next.handle().pipe(map(async (data) => this.handleResult(data, executionContext)))
  }

  private buildActivity(data: T, executionContext: ExecutionContext): Activity<T> {
    const userData = DispatchResponseToActivityInterceptor.getRequestUserData(executionContext)
    const request = DispatchResponseToActivityInterceptor.getRequest(executionContext)
    const Activity = this.reflector.get<ActivityConstructor<T>>(
      'activity',
      executionContext.getHandler(),
    )

    return new Activity(data, userData, request)
  }

  private async handleResult(data: T, executionContext: ExecutionContext): Promise<T> {
    const activity = DispatchResponseToActivityInterceptor.getContextActivity(executionContext)
    activity.refreshData(data)

    await this.activityAdapter.dispatch(activity).catch()

    return data
  }
}
