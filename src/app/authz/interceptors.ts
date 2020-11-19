import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'

import UserAggregateService from 'domain/user-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

@Injectable()
export class AuthzInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuthzInterceptor.name)

  constructor(private readonly userAggregateService: UserAggregateService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()

    const user: User = await this.userAggregateService.getUserForRequest(request)
    this.logger.debug({
      user,
      message: `Selected user with ID ${user.id} for current request. Selected data:`,
    })

    request._budUser = user

    return next.handle()
  }
}
