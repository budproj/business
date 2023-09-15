import { Injectable } from '@nestjs/common'

import { User, UserRepository } from 'src/mission-control/domain/users/repositories/user-repository'

export const STATIC_USERS: User[] = [
  {
    userId: '922ef72a-6c3c-4075-926a-3245cdeea75f',
    companyId: '0788abd6-4996-4224-8f24-094b2d3c0d3a',
    teamIds: ['d6310cc8-cc17-499b-a28c-5c600dd9714a'],
  },
  {
    userId: 'b159ef12-9062-49c6-8afc-372e8848fb15',
    companyId: '0788abd6-4996-4224-8f24-094b2d3c0d3a',
    teamIds: ['92c82e64-836c-44a5-a8c1-0db63cd340b3', 'd6310cc8-cc17-499b-a28c-5c600dd9714a'],
  },
]

@Injectable()
export class TypeormUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    return STATIC_USERS
  }

  async findById(userId: string): Promise<User> {
    return STATIC_USERS.find((user) => user.userId === userId)
  }
}
