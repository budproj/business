import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm'

import { KeyResult } from './entities'

export type KeyResultRepositoryFindSelector = Partial<Record<keyof KeyResult, string | number>>

@EntityRepository(KeyResult)
class KeyResultRepository extends Repository<KeyResult> {
  async getAllKeyResultsWithSelector(
    selector: KeyResultRepositoryFindSelector,
    relations?: Array<string | string[]>,
    orderHashmap?: Record<string, 'ASC' | 'DESC'>,
  ): Promise<KeyResult[]> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where(selector)
    const joinedQuery = relations?.reduce(this.reduceRelationsToSubQuery, query) ?? filteredQuery
    const orderedQuery = orderHashmap ? joinedQuery?.orderBy(orderHashmap) : joinedQuery

    return orderedQuery.getMany()
  }

  reduceRelationsToSubQuery(
    query: SelectQueryBuilder<KeyResult>,
    subQuery: string[] | string,
  ): SelectQueryBuilder<KeyResult> {
    const isString = typeof subQuery === 'string'

    const entity = isString ? (subQuery as string) : subQuery[0]
    const alias = isString ? (subQuery as string) : subQuery[1]

    return query.leftJoinAndSelect(`${KeyResult.name}.${entity}`, alias)
  }
}

export default KeyResultRepository
