import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'
import { CoreProvider } from '@core/core.provider'
import { Cacheable } from "@lib/cache/cacheable.decorator";

import { GraphQLRequest } from '../interfaces/request.interface'

@Injectable()
export class AddContextToUserInterceptor implements NestInterceptor {
  protected readonly godmode: GodmodeProvider
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

    request.userWithContext = this.godmode.enabled
      ? await this.godmode.getGodUser(this.core)
      : await this.getRequestUser(request)

    return next.handle()
  }

  @Cacheable(({ user }) => [user.id, user.token.sub, user.token.permissions], 15 * 60)
  private async getRequestUser(request: GraphQLRequest): Promise<UserWithContext> {
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
