import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class ObjectiveBaseAccessControl extends AccessControl {
  protected readonly resource = Resource.OBJECTIVE

  constructor(protected core: CorePortsProvider, coreProvider: CoreProvider) {
    super(core, coreProvider.team)
  }

  static isObjectiveOwner(objective: Objective, user: UserWithContext): boolean {
    return objective.ownerId === user.id
  }

  protected async resolveContextScopes(
    user: UserWithContext,
    teamID: string | undefined,
    ownerId: string,
  ): Promise<AccessControlScopes> {
    if (!teamID) {
      const teams = await this.teamProvider.getAscendantsFromUser(user.id, {
        rootsOnly: false,
      })

      const isCompanyMember = this.isTeamsMember(teams, user)

      return {
        isTeamLeader: false,
        isCompanyMember,
        isOwner: ownerId === user.id,
      }
    }

    const teams = await this.teamProvider.getAscendantsByIds([teamID], {
      rootsOnly: false,
      includeOriginTeams: true,
    })
    const isTeamLeader = this.isTeamLeader(teams, user)
    const isCompanyMember = this.isTeamsMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isTeamLeader,
    }
  }

  protected async resolveEntityScopes(user: UserWithContext, objectiveID: string): Promise<AccessControlScopes> {
    const objective = await this.core.dispatchCommand<Objective>('get-objective', {
      id: objectiveID,
    })

    const teams = objective.teamId
      ? await this.teamProvider.getAscendantsByIds([objective.teamId], {
          includeOriginTeams: true,
          rootsOnly: false,
        })
      : await this.teamProvider.getAscendantsFromUser(objective.ownerId, {
          rootsOnly: false,
        })

    const isObjectiveOwner = ObjectiveBaseAccessControl.isObjectiveOwner(objective, user)
    const isTeamLeader = this.isTeamLeader(teams, user)
    const isCompanyMember = this.isTeamsMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isObjectiveOwner,
    }
  }
}
