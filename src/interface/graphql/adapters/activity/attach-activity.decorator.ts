import { applyDecorators, UseInterceptors } from '@nestjs/common'

import { ActivityConstructor } from '@adapters/activity/types/activity-constructor.type'

import { AttachActivityMetadata } from './attach-activity.metadata'
import { DispatchResponseToActivityInterceptor } from './dispatch-response-to-activity.interceptor'

export function AttachActivity<T>(activityConstructor: ActivityConstructor<T>) {
  return applyDecorators(
    AttachActivityMetadata(activityConstructor),
    UseInterceptors(DispatchResponseToActivityInterceptor),
  )
}
