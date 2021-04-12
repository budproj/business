import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { AuthzAdapter } from '../authz.adapter'
import { AuthzToken } from '../interfaces/authz-token.interface'
import { AuthorizationUser } from '../interfaces/user.interface'
import { Permission } from '../types/permission.type'

import { GodmodePropertiesInterface } from './interfaces/godmode-properties.interface'

export class GodmodeProvider implements GodmodePropertiesInterface {
  public readonly enabled: boolean
  private readonly authz: AuthzAdapter

  constructor(properties: GodmodePropertiesInterface) {
    this.enabled = properties.enabled
    this.authz = new AuthzAdapter()
  }

  private get placeholder(): string {
    return 'GOD'
  }

  private get permissions(): Permission[] {
    return [
      'permission:create:any',
      'permission:read:any',
      'permission:update:any',
      'permission:create:any',
      'user:create:any',
      'user:read:any',
      'user:update:any',
      'user:delete:any',
      'team:create:any',
      'team:read:any',
      'team:update:any',
      'team:delete:any',
      'cycle:create:any',
      'cycle:read:any',
      'cycle:update:any',
      'cycle:delete:any',
      'objective:create:any',
      'objective:read:any',
      'objective:update:any',
      'objective:delete:any',
      'key-result:create:any',
      'key-result:read:any',
      'key-result:update:any',
      'key-result:delete:any',
      'key-result-comment:create:any',
      'key-result-comment:read:any',
      'key-result-comment:update:any',
      'key-result-comment:delete:any',
      'key-result-check-in:create:any',
      'key-result-check-in:read:any',
      'key-result-check-in:update:any',
      'key-result-check-in:delete:any',
    ]
  }

  public async getGodUser(coreProvider: CoreProvider): Promise<AuthorizationUser> {
    const user = await coreProvider.user.getOne({})
    const teams = await coreProvider.user.getUserTeams(user)

    const godUser = this.getGodAuthorizationUserBasedOnUserAndTeams(user, teams)

    return godUser
  }

  private getGodAuthorizationUserBasedOnUserAndTeams(
    user: UserInterface,
    teams: TeamInterface[],
  ): AuthorizationUser {
    const token = this.getGodToken()
    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(token.permissions)

    return {
      ...user,
      teams,
      token,
      resourcePolicy,
    }
  }

  private getGodToken(): AuthzToken {
    return {
      iss: this.placeholder,
      sub: this.placeholder,
      azp: this.placeholder,
      scope: this.placeholder,
      aud: [this.placeholder],
      iat: 0,
      exp: 0,
      permissions: this.permissions,
    }
  }
}
