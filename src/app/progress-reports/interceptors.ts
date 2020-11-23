import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  ForbiddenException,
} from '@nestjs/common'
import { Observable } from 'rxjs'

import { User } from 'domain/user-aggregate/user/entities'

import { PostProgressReportDTO } from './dto'
import ProgressReportService from './service'

@Injectable()
export class RejectNotOwnedKeyResults implements NestInterceptor {
  private readonly logger = new Logger(RejectNotOwnedKeyResults.name)

  constructor(private readonly progressReportService: ProgressReportService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()
    const { keyResultID } = request.body as PostProgressReportDTO
    const user = request._budUser as User

    const keyResultOwner = await this.progressReportService.getKeyResultOwner(keyResultID)
    if (user.id !== keyResultOwner.id)
      throw new ForbiddenException(
        `User ${user.id} is not allowed to report progress over key result ${keyResultID}`,
      )

    return next.handle()
  }
}
