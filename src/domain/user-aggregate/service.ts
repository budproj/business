import { Injectable, Logger } from '@nestjs/common'

import { User } from './user/entities'
import UserService, { UserFindFilter, UserFindWhereSelector } from './user/service'

@Injectable()
class UserAggregateService {
  private readonly logger = new Logger(UserAggregateService.name)
  constructor(private readonly userService: UserService) {}

  async getUserIDBasedOnAuthzSub(authzSub: User['authzSub']): Promise<User['id']> {
    const selector: UserFindWhereSelector = { authzSub }
    const filters: UserFindFilter[] = ['id']

    const userData = await this.userService.findOneWithFilter(selector, filters)

    return userData.id
  }
}

export default UserAggregateService
