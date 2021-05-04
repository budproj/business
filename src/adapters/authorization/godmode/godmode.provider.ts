import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { Permission } from '@adapters/policy/types/permission.type'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { AuthzToken } from '@infrastructure/authz/interfaces/authz-token.interface'

import { GodmodePropertiesInterface } from './interfaces/godmode-properties.interface'

export class GodmodeProvider implements GodmodePropertiesInterface {
  public readonly enabled: boolean
  private readonly authz: PolicyAdapter

  constructor(properties: GodmodePropertiesInterface) {
    this.enabled = properties.enabled
    this.authz = new PolicyAdapter()
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

  public async getGodUser(coreProvider: CoreProvider): Promise<UserWithContext> {
    const user = await coreProvider.user.getOne({})
    const teams = await coreProvider.user.getUserTeams(user)

    const godUser = this.getGodUserWithContextBasedOnUserAndTeams(user, teams)

    return godUser
  }

  private getGodUserWithContextBasedOnUserAndTeams(
    user: UserInterface,
    teams: TeamInterface[],
  ): UserWithContext {
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
