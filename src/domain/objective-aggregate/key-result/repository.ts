import {
  EntityRepository,
  ObjectLiteral,
  OrderByCondition,
  Repository,
  SelectQueryBuilder,
} from 'typeorm'

import { KeyResult } from './entities'

@EntityRepository(KeyResult)
class KeyResultRepository extends Repository<KeyResult> {
  async selectManyWithSelectorRelationsAndOrder(
    selector: ObjectLiteral,
    relations: Array<[string, string] | string>,
    orderHashmap: OrderByCondition,
  ): Promise<KeyResult[]> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where(selector)
    const joinedQuery = relations.reduce(this.reduceRelationsToSubQuery, filteredQuery)
    const orderedQuery = joinedQuery.orderBy(orderHashmap)

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
