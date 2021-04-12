import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { ServerRequest } from '@adapters/context/server-request.interface'
import { CoreProvider } from '@core/core.provider'

@Injectable()
export class NourishUserDataInterceptor implements NestInterceptor {
  private readonly logger = new Logger(NourishUserDataInterceptor.name)
  private readonly authz = new AuthzAdapter()

  constructor(private readonly core: CoreProvider) {}

  public async intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: ServerRequest = graphqlContext.getContext().req

    const { teams, ...user } = await this.core.user.getUserFromSubjectWithTeamRelation(
      request.user.token.sub,
    )
    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(
      request.user.token.permissions,
    )

    request.user = {
      ...request.user,
      ...user,
      teams,
      resourcePolicy,
    }

    this.logger.debug({
      requestUser: request.user,
      message: `Selected user with ID ${user.id} for current request`,
    })

    return next.handle()
  }
}
