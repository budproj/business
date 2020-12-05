import { EntityRepository, Repository } from 'typeorm'

import { Team } from './entities'

@EntityRepository(Team)
class DomainTeamRepository extends Repository<Team> {}

export default DomainTeamRepository
