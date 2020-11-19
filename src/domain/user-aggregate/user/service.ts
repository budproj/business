import { Injectable } from '@nestjs/common'

import { AuthzToken } from 'app/authz'

import { User } from './entities'
import UserRepository from './repository'

@Injectable()
class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUserForToken(authzToken: AuthzToken): Promise<User> {
    const user = this.repository.selectUserWithAuthzSub(authzToken.sub)

    return user
  }
}

export default UserService
