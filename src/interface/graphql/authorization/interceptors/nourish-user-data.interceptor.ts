import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { ContextInterface } from '@adapters/context/context.interface'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'
import { CoreProvider } from '@core/core.provider'

@Injectable()
export class NourishUserDataInterceptor implements NestInterceptor {
  protected readonly godmode: GodmodeProvider
  private readonly logger = new Logger(NourishUserDataInterceptor.name)
  private readonly authz = new AuthzAdapter()

  constructor(private readonly core: CoreProvider, private readonly config: GraphQLConfigProvider) {
    this.godmode = new GodmodeProvider(this.config.godmode)
  }

  public async intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: ContextInterface = graphqlContext.getContext().req

    request.user = this.godmode.enabled
      ? await this.godmode.getGodUser(this.core)
      : await this.getRequestUser(request)

    this.logger.debug({
      requestUser: request.user,
      message: `Selected user with ID ${request.user.id} for current request`,
    })

    return next.handle()
  }

  private async getRequestUser(request: ContextInterface): Promise<AuthorizationUser> {
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
