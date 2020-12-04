import { Injectable } from '@nestjs/common'

import DomainEntityService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { User } from './entities'
import DomainUserRepository from './repository'
import DomainUserViewService from './view/service'

@Injectable()
class DomainUserService extends DomainEntityService<User, UserDTO> {
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
