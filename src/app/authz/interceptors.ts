import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'

import UserAggregateService from 'domain/user-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

import { AuthzToken } from '.'

@Injectable()
export class AuthzInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuthzInterceptor.name)

  constructor(private readonly userAggregateService: UserAggregateService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()
    const authzToken: AuthzToken = request.user

    const user: User = await this.userAggregateService.getUserBasedOnAuthzSub(authzToken.sub)
    this.logger.debug({
      user,
      message: `Used user Auth0 sub ${authzToken.sub} to select user with ID ${user.id}. Selected data:`,
    })

    request._budUser = user

    return next.handle()
  }
}
