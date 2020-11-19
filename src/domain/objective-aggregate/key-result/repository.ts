import { Logger } from '@nestjs/common'
import { EntityRepository, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'

import { KeyResult } from './entities'

@EntityRepository(KeyResult)
class KeyResultRepository extends Repository<KeyResult> {
  defaultOrder = `${KeyResult.name}.updatedAt`

  private readonly logger = new Logger(KeyResultRepository.name)

  async selectManyWithRankAndRelations(
    selector: ObjectLiteral,
    rankSortColumn: string,
    relations: Array<[string, string] | string>,
  ): Promise<KeyResult[]> {
    this.logger.debug({
      rankSortColumn,
      message: `Using rankSortColumn to fetch key results`,
    })

    const query = this.createQueryBuilder()
    const filteredQuery = query.where(selector)
    const joinedQuery = relations.reduce(this.reduceRelationsToSubQuery, filteredQuery)
    const orderedByRank = joinedQuery.orderBy(rankSortColumn)
    const orderedByDefault = orderedByRank.addOrderBy(this.defaultOrder, 'DESC')

    return orderedByDefault.getMany()
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
