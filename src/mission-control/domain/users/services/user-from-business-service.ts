import { Injectable } from '@nestjs/common'

import { Stopwatch } from '@lib/logger/pino.decorator'

import { UserRepository } from '../repositories/user-repository'

@Injectable()
export class UserMissionControlRepository {
  constructor(private readonly repository: UserRepository) {}

  @Stopwatch()
  async getAllUsers() {
    return this.repository.findAll()
  }
}
