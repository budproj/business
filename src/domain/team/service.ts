import { Injectable } from '@nestjs/common'

import { CompanyDTO } from 'domain/company/dto'

import { Team } from './entities'
import TeamRepository from './repository'

@Injectable()
class TeamService {
  constructor(private readonly repository: TeamRepository) {}

  async getOneById(id: Team['id']): Promise<Team> {
    return this.repository.findOne({ id })
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Team[]> {
    return this.repository.find({ companyId })
  }
}

export default TeamService
