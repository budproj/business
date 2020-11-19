import { Injectable } from '@nestjs/common'

import { User } from 'domain/user-aggregate/user/entities'

import { KeyResult } from './entities'
import KeyResultRepository from './repository'

@Injectable()
class KeyResultService {
  relations = [['owner', 'user'], 'team', 'objective', 'progressReports', 'confidenceReports']
  order: Record<string, 'ASC' | 'DESC'> = {
    'progressReports.createdAt': 'DESC',
    'confidenceReports.createdAt': 'DESC',
  }

  constructor(private readonly keyResultRepository: KeyResultRepository) {}

  async getUserKeyResults(uid: User['id']): Promise<KeyResult[]> {
    const keyResults = await this.keyResultRepository.getAllKeyResultsWithSelector(
      { owner: uid },
      this.relations,
      this.order,
    )

    return keyResults
  }
}

export default KeyResultService
