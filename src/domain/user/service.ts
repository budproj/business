import { Injectable } from '@nestjs/common'

import { User } from './entities'
import UserRepository from './repository'

@Injectable()
class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getOneById(id: User['id']): Promise<User> {
    return this.repository.findOne({ id })
  }
}

export default UserService
