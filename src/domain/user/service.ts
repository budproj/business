import { Injectable } from '@nestjs/common'

import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { UserDTO } from 'src/domain/user/dto'

import { User } from './entities'
import DomainUserRepository from './repository'

export interface DomainUserServiceInterface {
  buildUserFullName: (user: UserDTO) => string
  getUserFromSubjectWithTeamRelation: (authzSub: UserDTO['authzSub']) => Promise<User>
}

@Injectable()
class DomainUserService extends DomainEntityService<User, UserDTO> {
  constructor(public readonly repository: DomainUserRepository) {
    super(repository, DomainUserService.name)
  }

  public buildUserFullName(user: UserDTO) {
    return `${user.firstName} ${user.lastName}`
  }

  public async getUserFromSubjectWithTeamRelation(authzSub: UserDTO['authzSub']) {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }

  protected async createIfUserIsInCompany(_data: Partial<User>, _queryContext: DomainQueryContext) {
    return {} as any
  }

  protected async createIfUserIsInTeam(_data: Partial<User>, _queryContext: DomainQueryContext) {
    return {} as any
  }

  protected async createIfUserOwnsIt(_data: Partial<User>, _queryContext: DomainQueryContext) {
    return {} as any
  }
}

export default DomainUserService
