import { EntityRepository, Repository } from 'typeorm'

import { Objective } from './entities'

@EntityRepository(Objective)
class ObjectiveRepository extends Repository<Objective> {}

export default ObjectiveRepository
