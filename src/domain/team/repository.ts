import { EntityRepository, Repository } from 'typeorm'

import { Team } from './entities'

@EntityRepository(Team)
class TeamRepository extends Repository<Team> {}

export default TeamRepository
