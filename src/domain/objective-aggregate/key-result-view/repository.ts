import { Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'

import { User } from 'domain/user-aggregate/user/entities'

import { KeyResultViewDTO, KeyResultViewBinding } from './dto'
import { KeyResultView } from './entities'

@EntityRepository(KeyResultView)
class KeyResultViewRepository extends Repository<KeyResultView> {
  private readonly logger = new Logger(KeyResultViewRepository.name)

  async selectViewRankForUserBinding(
    user: User['id'],
    binding: KeyResultViewBinding,
  ): Promise<KeyResultViewDTO['rank']> {
    const query = this.createQueryBuilder()
    const selectedViews = query.where({ user, binding })
    const data: KeyResultViewDTO | undefined = await selectedViews.getOne()
    const rank = data?.rank

    this.logger.debug(
      `The user ${user.toString()} binding "${binding}" custom rank is [${rank?.toString()}]`,
    )

    return rank
  }
}

export default KeyResultViewRepository
