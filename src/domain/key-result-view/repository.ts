import { EntityRepository, Repository } from 'typeorm'

import { KeyResultView } from './entities'

@EntityRepository(KeyResultView)
class KeyResultViewRepository extends Repository<KeyResultView> {}

export default KeyResultViewRepository
