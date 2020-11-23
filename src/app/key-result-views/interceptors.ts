import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'

import { User } from 'domain/user-aggregate/user/entities'

import KeyResultViewsService from './service'

@Injectable()
export class RejectNotOwnedViews implements NestInterceptor {
  private readonly logger = new Logger(RejectNotOwnedViews.name)

  constructor(private readonly keyResultViewsService: KeyResultViewsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()
    const keyResultViewID = request.params.id as number
    const user = request._budUser as User

    const isViewFromUser = await this.keyResultViewsService.isViewFromUser(keyResultViewID, user.id)
    if (!isViewFromUser)
      throw new ForbiddenException(
        `The view ${keyResultViewID.toString()} does not belongs to user ${user.id.toString()}`,
      )

    this.logger.log(
      `Validated that view ${keyResultViewID.toString()} belongs to user ${user.id.toString()}`,
    )

    return next.handle()
  }
}
