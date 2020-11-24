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
}

export default KeyResultViewService
