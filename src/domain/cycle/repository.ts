import { EntityRepository, Repository } from 'typeorm'

import { Cycle } from './entities'

@EntityRepository(Cycle)
class CycleRepository extends Repository<Cycle> {}

export default CycleRepository
