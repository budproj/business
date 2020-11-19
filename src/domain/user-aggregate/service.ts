import { Injectable, Logger } from '@nestjs/common'

import { AuthzRequest } from 'app/authz'

import { User } from './user/entities'
import UserService from './user/service'

@Injectable()
class UserAggregateService {
  private readonly logger = new Logger(UserAggregateService.name)

  constructor(private readonly userService: UserService) {}

  async getUserForRequest(request: AuthzRequest): Promise<User> {
    const authzToken = request.user
    const user = await this.userService.getUserForToken(authzToken)
    this.logger.debug(`Used Auth0 sub ${authzToken.sub} to fetch user with ID ${user.id}`)

    return user
  }
}

export default UserAggregateService
