import { Injectable } from '@nestjs/common'

import { UserRepository } from '../repositories/user-repository'

@Injectable()
export class UserMissionControlRepository {
  constructor(private readonly repository: UserRepository) {}

  async getAllUsers() {
    return this.repository.findAll()
  }
}
