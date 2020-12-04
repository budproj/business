import { Injectable } from '@nestjs/common'

import DomainService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { User } from './entities'
import DomainUserRepository from './repository'
import DomainUserViewService from './view/service'

@Injectable()
class DomainUserService extends DomainService<User, UserDTO> {
  constructor(
    public readonly view: DomainUserViewService,
    public readonly repository: DomainUserRepository,
  ) {
    super(repository, DomainUserService.name)
  }

  async getUserFromSubjectWithTeamRelation(authzSub: UserDTO['authzSub']): Promise<User> {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }
}

export default DomainUserService
