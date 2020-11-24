import { Injectable } from '@nestjs/common'

import { KeyResultView } from './entities'
import KeyResultViewRepository from './repository'

@Injectable()
class KeyResultViewService {
  constructor(private readonly repository: KeyResultViewRepository) {}

  async getOneById(id: KeyResultView['id']): Promise<KeyResultView> {
    return this.repository.findOne({ id })
  }
}

export default KeyResultViewService
