import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { User } from 'domain/user-aggregate/user/entities'

import { KeyResult } from './entities'

export type KeyResultFindWhereSelector = Partial<Record<keyof KeyResult, string | number>>

@Injectable()
class KeyResultService {
  constructor(
    @InjectRepository(KeyResult)
    private readonly keyResultRepository: Repository<KeyResult>,
  ) {}

  async getUserKeyResults(uid: User['id']): Promise<KeyResult[]> {
    const desiredRelations = [
      ['owner', 'user'],
      'team',
      'objective',
      'progressReports',
      'confidenceReports',
    ]
    const keyResults = this.getKeyResults({ owner: uid }, desiredRelations)

    return keyResults
  }

  async getKeyResults(
    selector: KeyResultFindWhereSelector,
    relations?: Array<string | string[]>,
  ): Promise<KeyResult[]> {
    const repository = this.keyResultRepository.createQueryBuilder()
    const query = repository.where(selector)
    const joinedQuery =
      relations?.reduce(
        (currentQuery: SelectQueryBuilder<KeyResult>, subQuery: string[] | string) =>
          currentQuery.leftJoinAndSelect(
            `${KeyResult.name}.${typeof subQuery === 'string' ? subQuery : subQuery[0]}`,
            typeof subQuery === 'string' ? subQuery : subQuery[1],
          ),
        query,
      ) ?? query

    return joinedQuery.getMany()
  }
}

export default KeyResultService
