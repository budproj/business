import { CanActivate, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class GraphQLRequiredPoliciesGuard implements CanActivate {
  private readonly logger = new Logger(GraphQLRequiredPoliciesGuard.name)

  constructor(private readonly authzAdapter: AuthzAdapter) {}

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
