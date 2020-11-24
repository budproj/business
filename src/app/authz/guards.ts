import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class GraphQLAuthGuard extends AuthGuard('jwt') {
  canActivate(rawContext: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(rawContext)
    const { req } = gqlContext.getContext()

    return super.canActivate(new ExecutionContextHost([req]))
  }
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(rawContext: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(rawContext)
    const request = gqlContext.getContext().req

    const routePermissions = this.reflector.get<string[]>('permissions', gqlContext.getHandler())
    const userPermissions = request.user.permissions ?? []

    if (!routePermissions) {
      return true
    }

    const hasPermission = () =>
      routePermissions.every((routePermission) => userPermissions.includes(routePermission))

    return hasPermission()
  }
}
