import { Injectable } from '@nestjs/common'

import { KeyResultViewDTO } from 'domain/key-result-view/dto'
import { UserDTO } from 'domain/user/dto'

import { KeyResultView } from './entities'
import KeyResultViewRepository from './repository'

@Injectable()
class KeyResultViewService {
  constructor(private readonly repository: KeyResultViewRepository) {}

  async getOneById(id: KeyResultViewDTO['id']): Promise<KeyResultView> {
    return this.repository.findOne({ id })
  }

  async getOneByIDIfUserOwnsIt(
    id: KeyResultViewDTO['id'],
    user: UserDTO,
  ): Promise<KeyResultView | null> {
    return this.repository.findOne({ id, userId: user.id })
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

export default KeyResultViewService
