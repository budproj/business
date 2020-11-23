import { Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'

import { User } from 'domain/user-aggregate/user/entities'

import { KeyResultViewDTO, KeyResultViewBinding } from './dto'
import { KeyResultView } from './entities'

@EntityRepository(KeyResultView)
class KeyResultViewRepository extends Repository<KeyResultView> {
  private readonly logger = new Logger(KeyResultViewRepository.name)

  async selectViewForUserBinding(
    user: User['id'],
    binding: KeyResultViewBinding,
  ): Promise<KeyResultViewDTO> {
    const query = this.createQueryBuilder()
    const selectedViews = query.where({ user, binding })
    const userView: KeyResultViewDTO | undefined = await selectedViews.getOne()

    this.logger.debug({
      userView,
      message: `Selected user ${user.toString()} binding "${binding}"`,
    })

    return userView
  }

  async selectViewsForUser(user: User['id']): Promise<KeyResultViewDTO[]> {
    const query = this.createQueryBuilder()
    const selectedViews = query.where({ user })
    const userViews: KeyResultViewDTO[] = await selectedViews.getMany()

    this.logger.debug({
      userViews,
      message: `Selected user ${user.toString()} views"`,
    })

    return userViews
  }
}

export default KeyResultViewRepository
