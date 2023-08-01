import { Injectable } from '@nestjs/common'

import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { ObjectiveBaseAccessControl } from './base.access-control'

@Injectable()
export class ObjectiveKeyResultAccessControl extends ObjectiveBaseAccessControl {
  protected readonly resource = Resource.OBJECTIVE

  constructor(protected core: CorePortsProvider, coreProvider: CoreProvider) {
    super(core, coreProvider)
  }

  static isObjectiveOwner(objective: Objective, user: UserWithContext): boolean {
    return objective.ownerId === user.id
  }

  protected async resolveContextScopes(user: UserWithContext, objectiveID: string): Promise<AccessControlScopes> {
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
