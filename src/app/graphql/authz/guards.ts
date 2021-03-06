import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

import AuthzService from 'src/app/authz/service'

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
    protected readonly configService: ConfigService,
    private readonly authzService: AuthzService,
  ) {
    this.godMode = configService.get<boolean>('godMode.enabled')
  }

  public canActivate(rawContext: ExecutionContext) {
    if (this.godMode) return true

    const gqlContext = GqlExecutionContext.create(rawContext)
    const request = gqlContext.getContext().req

    const routePermissions = this.authzService.parseHandlerPermissions(gqlContext.getHandler())
    const userPermissions = this.authzService.parseTokenPermissions(request.user.token)

    this.logger.debug({
      routePermissions,
      userPermissions,
      message: 'Checking if user is allowed in given route',
    })

    const hasPermission = this.authzService.userHasPermission(userPermissions, routePermissions)

    return hasPermission
  }
}
