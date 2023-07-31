import { DeleteResult, FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreEntity } from '@core/core.orm-entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { Cacheable } from '@lib/cache/cacheable.decorator'

import { Command } from '../policy/enums/command.enum'
import { Resource } from '../policy/enums/resource.enum'
import { PolicyAdapter } from '../policy/policy.adapter'

export class QueryGuardAdapter<E extends CoreEntity, I> {
  protected readonly authz = new PolicyAdapter()

  constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    protected readonly entity: CoreEntityProvider<E, I>,
  ) {}

  public async createWithActionScopeConstraint(
    data: Partial<I>,
    user: UserWithContext,
    command: Command = Command.CREATE,
  ): Promise<E[]> {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.createWithConstraint(data, queryContext)
  }

  @Cacheable((selector, user, command) => [user.id, selector, command], 15)
  public async getOneWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: UserWithContext,
    command: Command = Command.READ,
  ): Promise<E> {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.getOneWithConstraint(selector, queryContext)
  }

  @Cacheable((selector, user, options, command) => [user.id, selector, options, command], 15)
  public async getManyWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: UserWithContext,
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
    user: UserWithContext,
    command: Command = Command.UPDATE,
  ): Promise<E> {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.updateWithConstraint(selector, newData, queryContext)
  }

  public async deleteWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: UserWithContext,
    command: Command = Command.DELETE,
  ): Promise<DeleteResult> {
    const queryScope = this.authz.getResourceCommandScopeForUser(this.resource, command, user)
    const queryContext = await this.core.team.buildTeamQueryContext(user, queryScope)

    return this.entity.deleteWithConstraint(selector, queryContext)
  }
}
