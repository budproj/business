import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { KeyResult } from './entities'

export type KeyResultFindWhereSelector = Partial<Record<keyof KeyResult, string | number>>

@Injectable()
class KeyResultService {
  constructor(
    @InjectRepository(KeyResult)
    private readonly keyResultRepository: Repository<KeyResult>,
  ) {}

  async findWhere(selector: KeyResultFindWhereSelector): Promise<KeyResult[]> {
    return this.keyResultRepository.find({ where: selector })
  }
}

export default KeyResultService
