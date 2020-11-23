import { Logger } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'

import { UserDTO } from 'domain/user-aggregate/user/dto'
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

  async selectUserOf(id: KeyResultViewDTO['id']): Promise<UserDTO['id']> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedQuery = filteredQuery.leftJoinAndSelect(`${KeyResultView.name}.user`, 'user')
    const data = await joinedQuery.getOne()

    this.logger.debug({
      data,
      message: `Selected data while fetching for user of key result view with ID ${id}`,
    })

    return data.user.id
  }
}

export default KeyResultViewRepository
