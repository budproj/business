import { Injectable } from '@nestjs/common'

import { Team } from './entities'
import TeamRepository from './repository'

@Injectable()
class TeamService {
  constructor(private readonly repository: TeamRepository) {}

  async getOneById(id: Team['id']): Promise<Team> {
    return this.repository.findOne({ id })
  }
}

export default TeamService
