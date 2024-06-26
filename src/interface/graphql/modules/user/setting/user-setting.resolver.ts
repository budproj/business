import { UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { UserSettingInterface } from '@core/modules/user/setting/user-setting.interface'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { UserSettingUpdateRequest } from '@interface/graphql/modules/user/setting/requests/user-setting-update.request'
import { UserSettingGraphQLNode } from '@interface/graphql/modules/user/setting/user-setting.node'
import { UserAccessControl } from '@interface/graphql/modules/user/user.access-control'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { UserSettingUpdateMainTeamRequest } from './requests/user-setting-update-main-team.request'

@GuardedResolver(UserSettingGraphQLNode)
export class UserSettingGraphQLResolver extends GuardedNodeGraphQLResolver<
  UserSetting,
  UserSettingInterface
> {
  constructor(
    protected corePorts: CorePortsProvider,
    protected accessControl: UserAccessControl,
    core: CoreProvider,
  ) {
    super(Resource.USER_SETTING, core, core.user as any, accessControl)
  }

  @GuardedQuery(UserSettingGraphQLNode, 'user-setting:read', { name: 'userUserSetting' })
  protected async getUserForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canRead = await this.accessControl.canRead(userWithContext, request.id)
    if (!canRead) throw new UnauthorizedException()

    return {}
  }

  @GuardedMutation(UserSettingGraphQLNode, 'user-setting:update', { name: 'updateMainTeam' })
  protected async updateMainTeamInPreferencesForRequestAndRequestUserWithContext(
    @Args() request: UserSettingUpdateMainTeamRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canUpdate = await this.accessControl.canUpdate(userWithContext, request.userID)
    if (!canUpdate) throw new UnauthorizedException()

    return this.corePorts.dispatchCommand<UserSetting>(
      'update-main-team-in-preferences',
      request.userID,
      request.main_team_id,
    )
  }

  @GuardedMutation(UserSettingGraphQLNode, 'user-setting:update', { name: 'updateUserSetting' })
  protected async updateUserSettingForRequestAndRequestUserWithContext(
    @Args() request: UserSettingUpdateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canUpdate = await this.accessControl.canRead(userWithContext, request.userID)
    if (!canUpdate) throw new UnauthorizedException()

    return this.corePorts.dispatchCommand<UserSetting>(
      'update-user-setting',
      request.userID,
      request.key,
      request.value,
    )
  }

  @ResolveField('preferences', () => String, { nullable: false })
  protected async stringfyExtra(@Parent() userSettings: UserSettingGraphQLNode) {
    if (!userSettings.preferences.main_team) {
      // TODO: maybe one day elaborate a trigger in pure SQL to get the company as default
      const partialUser = { id: userSettings.userId }
      const companies = await this.core.team.getUserCompanies(partialUser)

      const newSettings = { ...userSettings.preferences, main_team: companies[0].id }

      return JSON.stringify(newSettings)
    }

    return JSON.stringify(userSettings.preferences)
  }
}
