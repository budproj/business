import { Injectable } from '@nestjs/common'
import { flatten, uniqBy } from 'lodash'
import { FindConditions, In } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { UserInterface } from './user.interface'
import { User } from './user.orm-entity'
import { UserRepository } from './user.repository'

@Injectable()
export class UserProvider extends CoreEntityProvider<User, UserInterface> {
  constructor(protected readonly repository: UserRepository) {
    super(UserProvider.name, repository)
  }

  public async getUserTeams(
    user: UserInterface,
    filters?: FindConditions<TeamInterface>,
    options?: GetOptions<TeamInterface>,
  ): Promise<TeamInterface[]> {
    const queryOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      id: user.id,
      ...filters,
    }

    const queryResult = await this.repository.find({
      relations: ['teams'],
      where: whereSelector,
      ...queryOptions,
    })
    return uniqBy(flatten(queryResult.map((user) => user.teams)), 'id')
  }

  public buildUserFullName(user: UserInterface) {
    return `${user.firstName} ${user.lastName}`
  }

  public async getUserFromSubjectWithTeamRelation(authzSub: UserInterface['authzSub']) {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }

  public async getFromID(id: string): Promise<User> {
    return this.repository.findOne({ id })
  }

  public async getFromIndexes(indexes: Partial<UserInterface>): Promise<User> {
    return this.repository.findOne(indexes)
  }

  public async getByIds(ids: string[]): Promise<User[]> {
    return this.repository.find({ where: { id: In(ids) } })
  }

  protected async protectCreationQuery(
    _query: CreationQuery<User>,
    _data: Partial<UserInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
