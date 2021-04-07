import { FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CoreEntity } from '@core/core.entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'

import { AuthzAdapter } from './authz.adapter'
import { Command } from './enums/command.enum'
import { Resource } from './enums/resource.enum'
import { AuthorizationUser } from './interfaces/user.interface'

export class QueryGuardAdapter<E extends CoreEntity, D> {
  protected readonly authz = new AuthzAdapter()

  constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    protected readonly entity: CoreEntityProvider<E, D>,
  ) {}

  public async createWithActionScopeConstraint(
    data: Partial<D>,
    user: AuthorizationUser,
    command: Command = Command.CREATE,
  ) {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.createWithConstraint(data, queryContext)
  }

  public async getOneWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthorizationUser,
    command: Command = Command.READ,
  ) {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.getOneWithConstraint(selector, queryContext)
  }

  public async getManyWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthorizationUser,
    command: Command = Command.READ,
  ) {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.getManyWithConstraint(selector, queryContext)
  }

  public async updateWithActionScopeConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: AuthorizationUser,
    command: Command = Command.UPDATE,
  ) {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.updateWithConstraint(selector, newData, queryContext)
  }

  public async deleteWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthorizationUser,
    command: Command = Command.DELETE,
  ) {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.deleteWithConstraint(selector, queryContext)
  }
}
