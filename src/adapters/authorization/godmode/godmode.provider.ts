import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { Permission } from '@adapters/policy/types/permission.type'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { AuthzToken } from '@infrastructure/authz/interfaces/authz-token.interface'

import { GodmodePropertiesInterface } from './interfaces/godmode-properties.interface'
import roles from './roles'

export class GodmodeProvider implements GodmodePropertiesInterface {
  public readonly enabled: boolean
  public readonly role: string
  private readonly authz: PolicyAdapter

  constructor(properties: GodmodePropertiesInterface) {
    this.enabled = properties.enabled
    this.authz = new PolicyAdapter()

    if (!Object.keys(roles).includes(properties.role.toLowerCase()))
      throw new Error('Invalid role, check your environment variables')

    this.role = properties.role
  }

  static get placeholder(): string {
    return 'GOD'
  }

  public get permissions(): Permission[] {
    return roles[this.role.toLowerCase()]
  }

  public get token(): AuthzToken {
    return {
      iss: GodmodeProvider.placeholder,
      sub: GodmodeProvider.placeholder,
      azp: GodmodeProvider.placeholder,
      scope: GodmodeProvider.placeholder,
      aud: [GodmodeProvider.placeholder],
      iat: 0,
      exp: 0,
      permissions: this.permissions,
    }
  }

  public async getGodUser(coreProvider: CoreProvider): Promise<UserWithContext> {
    const user = await coreProvider.user.getOne({})
    const teams = await coreProvider.user.getUserTeams(user)

    return this.getGodUserWithContextBasedOnUserAndTeams(user, teams)
  }

  private getGodUserWithContextBasedOnUserAndTeams(
    user: UserInterface,
    teams: TeamInterface[],
  ): UserWithContext {
    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(this.token.permissions)

    return {
      ...user,
      teams,
      token: this.token,
      resourcePolicy,
    }
  }
}
