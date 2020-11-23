import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'

export const View = createParamDecorator<KeyResultView>((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  return request._view
})
