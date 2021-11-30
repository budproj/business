import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { UserSettingInterface } from '@core/modules/user/setting/user-setting.interface'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { UserSettingGraphQLNode } from '@interface/graphql/modules/user/setting/user-setting.node'
import { UserAccessControl } from '@interface/graphql/modules/user/user.access-control'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

@GuardedResolver(UserSettingGraphQLNode)
export class UserSettingGraphQLResolver extends GuardedNodeGraphQLResolver<
  UserSetting,
  UserSettingInterface
> {
  private readonly logger = new Logger(UserSettingGraphQLResolver.name)

  constructor(
    protected corePorts: CorePortsProvider,
    protected accessControl: UserAccessControl,
    core: CoreProvider,
  ) {
    super(Resource.USER_SETTING, core, core.user as any, accessControl)
  }

  @GuardedQuery(UserSettingGraphQLNode, 'user-setting:read', { name: 'userSetting' })
  protected async getUserForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      message: 'Fetching user setting with provided indexes',
    })

    const canRead = await this.accessControl.canRead(userWithContext, request.id)
    if (!canRead) throw new UnauthorizedException()

    return {}
  }
}
