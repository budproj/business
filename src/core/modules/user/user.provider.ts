import { Injectable } from '@nestjs/common'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { UserEntity } from './user.entity'
import { UserInterface } from './user.interface'
import { UserRepository } from './user.repository'

@Injectable()
export class UserProvider extends CoreEntityProvider<UserEntity, UserInterface> {
  constructor(protected readonly repository: UserRepository) {
    super(UserProvider.name, repository)
  }

  public buildUserFullName(user: UserInterface) {
    return `${user.firstName} ${user.lastName}`
  }

  public async getUserFromSubjectWithTeamRelation(authzSub: UserInterface['authzSub']) {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }

  protected async protectCreationQuery(
    _query: CreationQuery<UserEntity>,
    _data: Partial<UserInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
