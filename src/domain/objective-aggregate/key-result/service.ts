import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { KeyResult } from './entities'

@Injectable()
class KeyResultService {
  constructor(
    @InjectRepository(KeyResult)
    private readonly keyResultRepository: Repository<KeyResult>,
  ) {}

  async findAll(): Promise<string> {
    return Promise.resolve('ok')
  }
}

export default KeyResultService
