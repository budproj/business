import { EntityRepository } from 'typeorm'

import DomainEntityRepository from 'domain/repository'

import { Team } from './entities'

@EntityRepository(Team)
class DomainTeamRepository extends DomainEntityRepository<Team> {}

export default DomainTeamRepository
