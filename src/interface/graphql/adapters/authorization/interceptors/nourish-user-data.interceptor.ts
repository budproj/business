import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'
import { CoreProvider } from '@core/core.provider'

import { GraphQLRequest } from '../../context/interfaces/request.interface'

@Injectable()
export class NourishUserDataInterceptor implements NestInterceptor {
  protected readonly godmode: GodmodeProvider
  private readonly logger = new Logger(NourishUserDataInterceptor.name)
  private readonly authz = new PolicyAdapter()

  constructor(private readonly core: CoreProvider, private readonly config: GraphQLConfigProvider) {
    this.godmode = new GodmodeProvider(this.config.godmode)
  }

  public async intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request: GraphQLRequest = graphqlContext.getContext().req

    request.state.user = this.godmode.enabled
      ? await this.godmode.getGodUser(this.core)
      : await this.getRequestUser(request)

    this.logger.debug({
      requestUser: request.state.user,
      message: `Selected user with ID ${request.state.user.id} for current request`,
    })

    return next.handle()
  }

  private async getRequestUser(request: GraphQLRequest): Promise<AuthorizationUser> {
    const { teams, ...user } = await this.core.user.getUserFromSubjectWithTeamRelation(
      request.state.user.token.sub,
    )
    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(
      request.state.user.token.permissions,
    )

    return {
      ...request.state.user,
      ...user,
      teams,
      resourcePolicy,
    }
  }
}
