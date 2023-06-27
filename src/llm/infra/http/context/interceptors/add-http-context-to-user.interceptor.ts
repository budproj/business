import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'

import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Cacheable } from '@lib/cache/cacheable.decorator'

import { HTTPRequest } from '../types'

@Injectable()
export class AddHTTPContextToUserInterceptor implements NestInterceptor {
  protected readonly godmode: GodmodeProvider
  private readonly logger = new Logger(AddHTTPContextToUserInterceptor.name)
  private readonly authz = new PolicyAdapter()

  constructor(private readonly core: CoreProvider) {}

  public async intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = executionContext.switchToHttp().getRequest<HTTPRequest>()

    request.userWithContext = await this.getRequestUser(request)

    this.logger.debug({
      requestUser: request.userWithContext,
      message: `Selected user with ID ${request.userWithContext?.id.toString()} for current request`,
    })

    return next.handle()
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Cacheable(({ user }) => [user.id, user.token.sub, user.token.permissions], 15 * 60)
  private async getRequestUser(request: HTTPRequest): Promise<UserWithContext> {
    const { teams, ...user } = await this.core.user.getUserFromSubjectWithTeamRelation(
      request.user.token.sub,
    )
    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(
      request.user.token.permissions,
    )

    return {
      ...request.user,
      ...user,
      teams,
      resourcePolicy,
    }
  }
}
