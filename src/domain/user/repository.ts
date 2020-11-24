import { EntityRepository, Repository } from 'typeorm'

import { User } from './entities'

@EntityRepository(User)
class KeyResultRepository extends Repository<User> {}

export default KeyResultRepository
