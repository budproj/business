import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from './entities'

export type UserFindWhereSelector = Partial<Record<keyof User, string | number>>
export type UserFindFilter = keyof User

@Injectable()
class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneWithFilter(
    selector: UserFindWhereSelector,
    filters: UserFindFilter[],
  ): Promise<User> {
    return this.userRepository.findOne({ where: selector, select: filters })
  }
}

export default UserService
