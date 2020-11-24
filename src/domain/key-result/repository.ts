import { EntityRepository, Repository } from 'typeorm'

import { KeyResult } from './entities'

@EntityRepository(KeyResult)
class KeyResultRepository extends Repository<KeyResult> {}

export default KeyResultRepository
