import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class ObjectiveBaseAccessControl extends AccessControl {
  protected readonly resource = Resource.OBJECTIVE

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  static isObjectiveOwner(objective: Objective, user: UserWithContext): boolean {
    return objective.ownerId === user.id
  }

  protected async resolveContextScopes(
    user: UserWithContext,
    teamID: string,
    ownerId: string,
  ): Promise<AccessControlScopes> {
    if (!teamID) {
      const userCompanies = await this.core.dispatchCommand<Team[]>('get-user-team-tree', {
        id: ownerId,
      })

      const isCompanyMember = await this.isCompanyMember(userCompanies, user)

      return {
        isTeamLeader: false,
        isCompanyMember,
        isOwner: ownerId === user.id,
      }
    }

    const teams = await this.core.dispatchCommand<Team[]>('get-team-tree', { id: teamID })
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isCompanyMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isTeamLeader,
    }
  }

  protected async resolveEntityScopes(
    user: UserWithContext,
    objectiveID: string,
  ): Promise<AccessControlScopes> {
    const objective = await this.core.dispatchCommand<Objective>('get-objective', {
      id: objectiveID,
    })

    const teams = objective.teamId
      ? await this.core.dispatchCommand<Team[]>('get-objective-team-tree', objective)
      : await this.core.dispatchCommand<Team[]>('get-user-team-tree', { id: objective.ownerId })

    const isObjectiveOwner = ObjectiveBaseAccessControl.isObjectiveOwner(objective, user)
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isCompanyMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isObjectiveOwner,
    }
  }
}
