import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class GraphQLAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(GraphQLAuthGuard.name)

  canActivate(rawContext: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(rawContext)
    const request = gqlContext.getContext().req

    this.logger.debug({
      request,
      message: 'Evaluating if we should allow request',
    })

    return super.canActivate(new ExecutionContextHost([request]))
  }
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name)

  constructor(private readonly reflector: Reflector) {}

  canActivate(rawContext: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(rawContext)
    const request = gqlContext.getContext().req

    const routePermissions = this.reflector.get<string[]>('permissions', gqlContext.getHandler())
    const userPermissions = request.user.permissions ?? []

    this.logger.debug({
      routePermissions,
      userPermissions,
      message: 'Checking if user is allowed in given route',
    })

    if (!routePermissions) {
      return true
    }

    const hasPermission = () =>
      routePermissions.every((routePermission) => userPermissions.includes(routePermission))

    return hasPermission()
  }
}
