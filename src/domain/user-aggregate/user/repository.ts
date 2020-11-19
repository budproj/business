import { EntityRepository, Repository } from 'typeorm'

import { User } from './entities'

export type UserFindWhereSelector = Partial<Record<keyof User, string | number>>
export type UserFindFilter = keyof User

@EntityRepository(User)
class UserRepository extends Repository<User> {
  async findUserWithAuthzSub(authzSub: User['authzSub']): Promise<User> {
    const query = this.createQueryBuilder()
    const queryWithID = query.where({ authzSub })

    return queryWithID.getOne()
  }
}

export default UserRepository
