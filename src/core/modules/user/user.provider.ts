import { Injectable } from '@nestjs/common'
import { flatten, uniqBy } from 'lodash'
import { FindConditions } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { TeamInterface } from '@core/modules/team/team.interface'
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
    const teams = uniqBy(flatten(queryResult.map((user) => user.teams)), 'id')

    return teams
  }

  public buildUserFullName(user: UserInterface) {
    return `${user.firstName} ${user.lastName}`
  }

  public async getUserFromSubjectWithTeamRelation(authzSub: UserInterface['authzSub']) {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }

  protected async protectCreationQuery(
    _query: CreationQuery<User>,
    _data: Partial<UserInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
