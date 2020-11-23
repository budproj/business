import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'

import { KeyResultViewDTO } from 'domain/objective-aggregate/key-result-view/dto'

import { User } from '../../domain/user-aggregate/user/entities'

import KeyResultsService from './service'

@Injectable()
export class InjectKeyResultView implements NestInterceptor {
  private get headerKey() {
    return 'view-id'
  }

  private readonly logger = new Logger(InjectKeyResultView.name)

  constructor(private readonly keyResultsService: KeyResultsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()
    const viewBinding = request.query.viewBinding as KeyResultViewDTO['binding']
    const user = request._budUser as User

    const view = viewBinding && (await this.keyResultsService.getUserBindedView(user, viewBinding))
    if (view) {
      const response = context.switchToHttp().getResponse()

      request._view = view
      response.header(this.headerKey, view.id)
      this.logger.log({
        view,
        message: `Selected user ${user.id} binded view for binding "${viewBinding}"`,
      })
    }

    return next.handle()
  }
}
