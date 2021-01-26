import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

import { PERMISSION, SCOPED_PERMISSION } from 'src/app/authz/constants'

@Injectable()
export class GraphQLAuthzAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(GraphQLAuthzAuthGuard.name)

  constructor(protected readonly configService: ConfigService) {
    super()
  }

  public canActivate(
    rawContext: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isGodModeEnabled = this.configService.get<boolean>('godMode.enabled')

    if (isGodModeEnabled) return true

    const gqlContext = GqlExecutionContext.create(rawContext)
    const request = gqlContext.getContext().req
    const guardRequest = () => super.canActivate(new ExecutionContextHost([request]))

    this.logger.debug({
      message: 'Evaluating if we should allow request',
    })

    return guardRequest()
  }
}

@Injectable()
export class GraphQLAuthzPermissionGuard implements CanActivate {
  private readonly godMode: boolean
  private readonly logger = new Logger(GraphQLAuthzPermissionGuard.name)

  constructor(
    private readonly reflector: Reflector,
    protected readonly configService: ConfigService,
  ) {
    this.godMode = configService.get<boolean>('godMode')
  }

  public canActivate(rawContext: ExecutionContext) {
    if (this.godMode) return true

    const gqlContext = GqlExecutionContext.create(rawContext)
    const request = gqlContext.getContext().req

    const routePermissions = this.reflector.get<PERMISSION[]>(
      'permissions',
      gqlContext.getHandler(),
    )
    const userScopedPermissions: SCOPED_PERMISSION[] = request.user.token.permissions ?? []

    this.logger.debug({
      routePermissions,
      userScopedPermissions,
      message: 'Checking if user is allowed in given route',
    })

    if (!routePermissions) {
      return true
    }

    const hasPermission = () =>
      routePermissions.every((routePermission) =>
        userScopedPermissions.some((userScopedPermission) =>
          userScopedPermission.includes(routePermission),
        ),
      )

    return hasPermission()
  }
}
