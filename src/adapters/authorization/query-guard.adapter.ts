import { DeleteResult, FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CoreEntity } from '@core/core.orm-entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'
import { GetOptions } from '@core/interfaces/get-options'

import { AuthzAdapter } from './authz.adapter'
import { Command } from './enums/command.enum'
import { Resource } from './enums/resource.enum'
import { AuthorizationUser } from './interfaces/user.interface'

export class QueryGuardAdapter<E extends CoreEntity, I> {
  protected readonly authz = new AuthzAdapter()

  constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    protected readonly entity: CoreEntityProvider<E, I>,
  ) {}

  public async createWithActionScopeConstraint(
    data: Partial<I>,
    user: AuthorizationUser,
    command: Command = Command.CREATE,
  ): Promise<E[]> {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.createWithConstraint(data, queryContext)
  }

  public async getOneWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthorizationUser,
    command: Command = Command.READ,
  ): Promise<E> {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.getOneWithConstraint(selector, queryContext)
  }

  public async getManyWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthorizationUser,
    options?: GetOptions<E>,
    command: Command = Command.READ,
  ): Promise<E[]> {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.getManyWithConstraint(selector, queryContext, options)
  }

  public async updateWithActionScopeConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: AuthorizationUser,
    command: Command = Command.UPDATE,
  ): Promise<E> {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.updateWithConstraint(selector, newData, queryContext)
  }

  public async deleteWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthorizationUser,
    command: Command = Command.DELETE,
  ): Promise<DeleteResult> {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.deleteWithConstraint(selector, queryContext)
  }
}
