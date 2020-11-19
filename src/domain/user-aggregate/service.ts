import { Injectable, Logger } from '@nestjs/common'

import { User } from './user/entities'
import UserService, { UserFindFilter, UserFindWhereSelector } from './user/service'

@Injectable()
class UserAggregateService {
  private readonly logger = new Logger(UserAggregateService.name)
  constructor(private readonly userService: UserService) {}

  async getUserBasedOnAuthzSub(authzSub: User['authzSub']): Promise<User> {
    const selector: UserFindWhereSelector = { authzSub }
    const user = await this.userService.getUser(selector)

    return user
  }

  async getUserIDBasedOnAuthzSub(authzSub: User['authzSub']): Promise<User['id']> {
    const selector: UserFindWhereSelector = { authzSub }
    const filters: UserFindFilter[] = ['id']

    const userData = await this.userService.getUserWithFilters(selector, filters)

    return userData.id
  }
}

export default UserAggregateService
