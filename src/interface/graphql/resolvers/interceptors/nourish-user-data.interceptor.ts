import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { ServerRequest } from '@adapters/context/server-request.interface'
import { CoreProvider } from '@core/core.provider'
import { UserInterface } from '@core/modules/user/user.interface'

@Injectable()
export class NourishUserDataInterceptor implements NestInterceptor {
  private readonly logger = new Logger(NourishUserDataInterceptor.name)
  private readonly authz = new AuthzAdapter()

  constructor(private readonly core: CoreProvider) {}

  public async intercept(executionContext: ExecutionContext, next: CallHandler) {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: ServerRequest = graphqlContext.getContext().req

    const {
      teams,
      ...user
    }: UserInterface = await this.core.user.getUserFromSubjectWithTeamRelation(
      request.user.token.sub,
    )
    const resourcePolicies = this.authz.getResourcePoliciesFromPermissions(
      request.user.token.permissions,
    )

    request.user = {
      ...request.user,
      ...user,
      teams,
      resourcePolicies,
    }

    this.logger.debug({
      requestUser: request.user,
      message: `Selected user with ID ${user.id} for current request`,
    })

    return next.handle()
  }
}
