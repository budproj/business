import { CallHandler, ExecutionContext, Logger, NestInterceptor, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Action } from '@adapters/policy/types/action.type'
import { Permission } from '@adapters/policy/types/permission.type'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'
import { CoreProvider } from '@core/core.provider'
import { User } from '@core/modules/user/user.orm-entity'
import { BaseAuthorizationGraphQLReflector, GraphQLGuard } from '@interface/graphql/adapters/authorization/reflectors/base.reflector'
import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { Observable } from 'rxjs'

export abstract class ControlGraphQLEntityAccessInterceptor extends BaseAuthorizationGraphQLReflector implements NestInterceptor {
  protected readonly godmode: GodmodeProvider
  private readonly logger = new Logger(ControlGraphQLEntityAccessInterceptor.name)

  constructor(
    protected readonly reflector: Reflector,
    protected readonly core: CoreProvider,
    config: GraphQLConfigProvider,
  ) {
    super(reflector)

    this.godmode = new GodmodeProvider(config.godmode)
  }

  public async intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (this.godmode.enabled) next.handle()

    const graphqlExecutionContext = this.getGraphQLExecutionContext(executionContext)
    const request = this.getGraphQLRequestFromContext(graphqlExecutionContext)
    const resolverRequiredActions = this.getResolverRequiredActions(graphqlExecutionContext)
    const user = await this.core.user.getUserFromSubjectWithTeamRelation(request.user.token.sub)

    const requiredPermissions = await this.getRequiredPermissionsForUserAndActions(
      user,
      resolverRequiredActions,
    )
    const isAllowedToExecute = this.authorization.canUserExecutePermissions(
      request.user,
      requiredPermissions,
    )

    console.log(isAllowedToExecute)

    return next.handle(
    )
  }

  protected abstract getRequiredPermissionsForUserAndActions(
    user: User,
    actions: Action[],
  ): Promise<Permission[]>
}
