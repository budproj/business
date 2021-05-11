import { Injectable } from '@nestjs/common'

import { Command } from '@adapters/policy/enums/command.enum'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { KeyResultBaseAccessControl } from '@interface/graphql/modules/key-result/access-control/base.access-control'

@Injectable()
export class KeyResultAccessControl extends KeyResultBaseAccessControl {
  protected readonly resource = Resource.KEY_RESULT

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  public async canCreate(_user: UserWithContext, _id: string): Promise<boolean> {
    return false
  }

  public async canRead(_user: UserWithContext, _id: string): Promise<boolean> {
    return false
  }

  public async canUpdate(user: UserWithContext, id: string): Promise<boolean> {
    const keyResult = await this.core.dispatchCommand<KeyResult>('get-key-result', { id })
    const teams = await this.core.dispatchCommand<Team[]>('get-key-result-team-tree', keyResult)

    const isKeyResultOwner = await this.isKeyResultOwner(keyResult, user)
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isKeyResultCompanyMember(keyResult, user)

    return this.canActivate(user, Command.UPDATE, isKeyResultOwner, isTeamLeader, isCompanyMember)
  }

  public async canDelete(_user: UserWithContext, _id: string): Promise<boolean> {
    return false
  }
}
