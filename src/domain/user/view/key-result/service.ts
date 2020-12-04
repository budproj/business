import { Injectable } from '@nestjs/common'

import DomainService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { KeyResultViewDTO } from './dto'
import { KeyResultView } from './entities'
import DomainKeyResultViewRepository from './repository'

@Injectable()
class DomainKeyResultViewService extends DomainService<KeyResultView, KeyResultViewDTO> {
  constructor(public readonly repository: DomainKeyResultViewRepository) {
    super(repository, DomainKeyResultViewService.name)
  }

  async getOneById(id: KeyResultViewDTO['id']): Promise<KeyResultView> {
    return this.repository.findOne({ id })
  }

  async getOneByBindingIfUserOwnsIt(
    binding: KeyResultViewDTO['binding'],
    user: UserDTO,
  ): Promise<KeyResultView | null> {
    return this.repository.findOne({ binding, userId: user.id })
  }

  async updateRankIfUserOwnsIt(
    id: KeyResultViewDTO['id'],
    newRank: KeyResultViewDTO['rank'],
    user: UserDTO,
  ): Promise<KeyResultView | null> {
    const newData = {
      rank: newRank,
    }
    const conditions = {
      id,
      userId: user.id,
    }

    return this.repository.updateWithConditions(newData, conditions)
  }

  async create(
    keyResultViews: Partial<KeyResultViewDTO> | Array<Partial<KeyResultViewDTO>>,
  ): Promise<KeyResultView[]> {
    const data = await this.repository.insert(keyResultViews)

    return data.raw
  }
}

export default DomainKeyResultViewService
