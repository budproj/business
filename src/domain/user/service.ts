import { Injectable } from '@nestjs/common'

import { UserDTO } from 'domain/user/dto'

import { User } from './entities'
import UserRepository from './repository'

@Injectable()
class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getOneById(id: UserDTO['id']): Promise<User> {
    return this.repository.findOne({ id })
  }

  async getUserFromSubjectWithTeamRelation(authzSub: UserDTO['authzSub']): Promise<User> {
    return this.repository.findOne({ authzSub }, { relations: ['teams'] })
  }
}

export default UserService
