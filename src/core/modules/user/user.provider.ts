import { Injectable } from '@nestjs/common'
import { DomainCreationQuery, DomainQueryContext } from 'src/domain/entity'
import { UserDTO } from 'src/domain/user/dto'

import { User } from './entities'
import DomainUserRepository from './repository'

export interface DomainUserServiceInterface {
  buildUserFullName: (user: UserDTO) => string
  getUserFromSubjectWithTeamRelation: (authzSub: UserDTO['authzSub']) => Promise<User>
}

@Injectable()
export class UserProvider extends EntityProvider<User, UserDTO> {
  constructor(protected readonly repository: DomainUserRepository) {
    super(DomainUserService.name, repository)
  }

  public buildUserFullName(user: UserDTO) {
    return `${user.firstName} ${user.lastName}`
  }

  public async getUserFromSubjectWithTeamRelation(authzSub: UserDTO['authzSub']) {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }

  protected async protectCreationQuery(
    _query: DomainCreationQuery<User>,
    _data: Partial<UserDTO>,
    _queryContext: DomainQueryContext,
  ) {
    return []
  }
}
