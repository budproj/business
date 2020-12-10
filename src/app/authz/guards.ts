import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class GraphQLAuthGuard extends AuthGuard('jwt') {
  private readonly godMode: boolean
  private readonly logger = new Logger(GraphQLAuthGuard.name)

  constructor(private readonly configService: ConfigService) {
    super()
    this.godMode = configService.get<boolean>('godMode')
  }

  canActivate(rawContext: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (this.godMode) return true

    const gqlContext = GqlExecutionContext.create(rawContext)
    const request = gqlContext.getContext().req
    const allowRequest = () => super.canActivate(new ExecutionContextHost([request]))

    this.logger.debug({
      request,
      message: 'Evaluating if we should allow request',
    })

    return allowRequest()
  }
}

@Injectable()
export class GraphQLPermissionsGuard implements CanActivate {
  private readonly godMode: boolean
  private readonly logger = new Logger(GraphQLPermissionsGuard.name)

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.godMode = configService.get<boolean>('godMode')
  }

  canActivate(rawContext: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (this.godMode) return true

    const gqlContext = GqlExecutionContext.create(rawContext)
    const request = gqlContext.getContext().req

    const routePermissions = this.reflector.get<string[]>('permissions', gqlContext.getHandler())
    const userPermissions = request.user.token.permissions ?? []

    this.logger.debug({
      routePermissions,
      userPermissions,
      message: 'Checking if user is allowed in given route',
    })

    if (!routePermissions) {
      return true
    }

    const hasPermission = () =>
      routePermissions.every((routePermission) =>
        userPermissions.some((userPermission) => userPermission.includes(routePermission)),
      )

    return hasPermission()
  }
}
